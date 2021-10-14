const convert = require("../units.js");

module.exports = {
    name: "convert",
    aliases: ["c"],
    description: "Convert units",
    args: "<quantity> <source unit> <destination unit>",
    handle: (bot, message, reader) => {
    
        let qty, srcUnit;
        const first = reader.readToken();
        const parsed = first.match(/([-+]?\d+\.?\d?)(\w+)/);
        if(parsed) {
            qty = Number(parsed[1]);
            srcUnit = parsed[2];
        } else {
            qty = Number(first);
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