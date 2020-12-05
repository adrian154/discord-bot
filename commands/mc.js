const Discord = require("discord.js");

const config = require("../config.json");

module.exports = {
    name: "mc",
    usage: "mc",
    description: "Shows information about the Minecraft server",
    handle: (bot, message) => {

        let status = bot.mc.opened ? ":green_circle: Connected" : ":red_circle: Lost connection, reconnecting..."

        const embed = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Minecraft Server")
            .addFields(
                {name: "IP", value: config.mc.host, inline: true},
                {name: "Status", value: status, inline: true}
            )
            .setTimestamp();

        message.channel.send(embed);

    }
}