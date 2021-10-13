const convert = require("../units.js");

module.exports = {
    name: "c",
    description: "Convert units",
    args: "<quantity> <source unit> <destination unit>",
    handle: (bot, message, tokens) => {
    
        const parsed = tokens.join(" ").match(/([-+]?\d+\.?\d?)\s*(\w+)\s+(\w+)/);
        if(!parsed) return false;

        try {
            const qty = Number(parsed[1]);
            if(qty) {
                message.reply(convert(qty, parsed[2], parsed[3]));
            } else {
                return false;
            }
        } catch(error) {
            message.reply(error.message).catch(error);
        }
        
        return true;

    }
};