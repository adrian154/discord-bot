module.exports = {
    name: "evalfunc",
    description: "Evaluates JavaScript code",
    usage: "eval",
    privileged: true,
    handle: (bot, message, tokens) => {
        try {

            const body = message.content.match(/```(.+)```/s)[1];

            const consoleOutput = [];
            const func = new Function("console", body);
            const result = func({
                log: (...params) => {
                    consoleOutput.push(params.join(" "));
                }
            });

            let str = "Result: `" + result + "`";
            if(consoleOutput.length > 0) {
                str += "\nConsole: ```" + consoleOutput.join("\n") + "```";
            }
            
            message.channel.send(str).catch(console.error);

        } catch(error) {
            message.channel.send(`Evaluation failed: ` + error);
        }
    }
};