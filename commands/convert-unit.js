const convert = require("../units.js");

module.exports = {
    name: "convert",
    aliases: ["c"],
    description: "Convert units",
    args: "<quantity> <source unit> <destination unit>",
    handle: (bot, message, reader) => {
    
        let qty, srcUnit;
        const parsed = reader.peek().match(/([-+]?\d+\.?\d?)(\w+)/);
        if(parsed) {
            qty = Number(parsed[1]);
            srcUnit = Number(parsed[2]);
        } else {
            qty = Number(reader.readToken());
            srcUnit = reader.readToken();
        }

        const destUnit = reader.readToken();

        try {
            message.reply(convert(qty, srcUnit, destUnit));
        } catch(error) {
            message.reply(error.message).catch(error);
        }

    }
};