const Discord = require("discord.js");
const fetch = require("node-fetch");

const deformat = (str) => str.replace(/§./g, "");

module.exports = {
    name: "pingserver",
    aliases: ["ping"],
    description: "Pings a Minecraft server",
    args: "<server host:port>",
    handle: async (bot, message, reader) => {
        
        const [host, portStr] = reader.readToken().split(":");
        const port = Number(portStr) || 25565;

        try {

            const resp = await fetch(`https://apis.bithole.dev/mc/ping-server?host=${host}&port=${port}`);
            const serverData = await resp.json();

            if(serverData.error) {
                message.channel.send(`:x: That server appears to be offline. \nActual error: \`${serverData.error}\``).catch(console.error);
            } else {
                const embed = new Discord.MessageEmbed()
                    .setTitle(host)
                    .addField("Version", deformat(serverData.version.name))
                    .addField("Protocol", String(serverData.version.protocol), true)
                    .addField("Players", `${serverData.players.online}/${serverData.players.max}`, true)
                    .setThumbnail(serverData.faviconURL);
                
                message.channel.send({embeds: [embed]}).catch(console.error);
            }

        } catch(error) {
            message.channel.send(`:x: The ping API failed :(`).catch(console.error);
        }

    }
};