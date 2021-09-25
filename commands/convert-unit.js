const convert = require("../units.js");

module.exports = {
    name: "convert",
    description: "Convert units",
    args: "<quantity> <source unit> <destination unit>",
    handle: (bot, message, tokens) => {
        
        try {
            const qty = Number(tokens[0]);
            if(qty) {
                message.reply(convert(qty, tokens[1], tokens[2]));
            } else {
                return false;
            }
        } catch(error) {
            message.reply(error.message).catch(error);
        }
        
        return true;

    }
};