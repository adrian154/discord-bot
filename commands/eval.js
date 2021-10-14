module.exports = {
    name: "eval",
    description: "Evaluates an expression",
    args: "<expression>",
    privileged: true,
    handle: (bot, message, reader) => {
        
        try {
            message.reply(`Result: \`${eval(reader.tokens.join(" "))}\``).catch(console.error);
        } catch(error) {
            message.reply("Evaluation failed: `" + error + "`").catch(console.error);
        }

    }
};