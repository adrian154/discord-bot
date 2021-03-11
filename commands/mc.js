const Discord = require("discord.js");
const config = require("../config.json");

module.exports = {
    name: "mc",
    description: "Shows information about the Minecraft server",
    handle: (bot, message) => {

        const status = bot.mc.opened ? ":green_circle: Connected" : ":red_circle: Lost connection, reconnecting..."

        const embed = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Minecraft Server")
            .addFields(
                {name: "IP", value: "`" + config.mc.host + "`"},
                {name: "Status", value: status}
            )
            .setTimestamp();

        message.channel.send(embed).catch(console.error);
        return true;

    }
}