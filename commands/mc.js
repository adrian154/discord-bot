const Discord = require("discord.js");

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
                { name: "Status", value: status}
            )
            .setTimestamp();

        message.channel.send(embed);

    }
}