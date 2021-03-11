module.exports = {
    name: "eval",
    description: "Evaluates an expression",
    args: "<expression>",
    privileged: true,
    handle: (bot, message, tokens) => {
        
        try {
            message.channel.send(`Result: \`${eval(tokens.join(" "))}\``).catch(console.error);
        } catch(error) {
            message.channel.send("Evaluation failed: `" + error + "`");
        }

        return true;

    }
};