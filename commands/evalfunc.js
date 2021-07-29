module.exports = {
    name: "exec",
    description: "Runs JavaScript code",
    args: "<code>",
    privileged: true,
    handle: (bot, message, tokens) => {

        try {

            const body = message.content.match(/```(.+)```/s)?.[1];
            if(!body) return false;

            // pass "console" object as variable
            const consoleOutput = [];
            const func = new Function("console", "require", body); 

            const result = func(
                {
                    log: (...params) => {
                        consoleOutput.push(params.join(" "));
                    }
                },
                require
            );


            let str = "Result: `" + result + "`";
            if(consoleOutput.length > 0) {
                str += "\nConsole: ```" + consoleOutput.join("\n") + "```";
            }
            
            message.channel.send(str).catch(console.error);

        } catch(error) {
            message.channel.send("`" + error + "`");
        }

        return true;

    }
};