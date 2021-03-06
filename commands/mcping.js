const Discord = require("discord.js");
const MC = require("node-mc-api");
const config = require("../config.json");

const deformat = (str) => str.replace(/§./g, "");

module.exports = {
    name: "ping",
    description: "Pings a Minecraft server",
    args: "<server host:port>",
    handle: async (bot, message, tokens) => {
        
        const [host, portStr] = tokens[0].split(":");
        const port = Number(portStr) || 25565;

        try {
            
            const serverData = await MC.pingServer(host, {port: port, timeout: 1000});
            const faviconLink = serverData.favicon ? bot.webend.addIcon(host, serverData.favicon) : ((config.debug ? "http://localhost" : "https://" + config.web.hostname) + "/static/default.png");

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

        return true;

    }
};