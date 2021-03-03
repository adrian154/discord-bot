const Discord = require("discord.js");
const MC = require("node-mc-api");

const deformat = (str) => str.replace(/§./g, "");

module.exports = {
    name: "ping",
    description: "Pings a Minecraft server",
    usage: "ping <server host> <port>",
    handle: async (bot, message) => {
        
        let host, port;
        if(tokens.length == 1) {
            const split = tokens[0].split(":");
            host = split[0];
            port = split[1];
        } else if(tokens.length == 2) {
            host = tokens[0];
            port = Number(tokens[1]);
        }

        try {
            
            const serverData = await MC.pingServer(host, {port: port, timeout: 1000});
            const faviconLink = bot.webend.addIcon(host, serverData.favicon);

            message.channel.send(
                new Discord.MessageEmbed()
                    .setTitle(host)
                    .addField("Version", deformat(serverData.version.name))
                    .addField("Protocol", serverData.version.protocol, true)
                    .addField("Players", `${serverData.players.online}/${serverData.players.max}`, true)
                    .setThumbnail(faviconLink)
            ).catch(console.error);

        } catch(error) {
            message.channel.send(`:x: That server appears to be offline, or I'm malfunctioning.\nActual error: \`${error}\``).catch(console.error);
        }

    }
};