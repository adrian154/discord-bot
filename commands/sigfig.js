const countSigFigs = numberStr => {

    const number = numberStr.split("");
    const sigFigChars = "123456789";

    const firstSF = number.findIndex(char => sigFigChars.includes(char));
    const decimalPoint = number.indexOf(".");
    const lastSF = number.length - number.reverse().findIndex(char => sigFigChars.includes(char)) - 1;

    if(decimalPoint > firstSF) {
        return number.length - 1;
    } else if(firstSF > decimalPoint) {
        return lastSF - firstSF + 1;
    } else {
        const firstAfterDecimal = number.findIndex((char, index) => sigFigChars.includes(char) && index > decimalPoint);
        return number.length - firstAfterDecimal + 1;
    }

};

module.exports = {
    name: "sigfig",
    aliases: ["sf"],
    description: "Counts the number of significant figures in a number",
    args: "<number>",
    handle: (bot, message, reader) => {

        const token = reader.readToken();
        if(!Number(token)) {
            message.reply("Invalid number.").catch(console.error);
        } else {
            message.reply(`${token} has ${countSigFigs(token)} significant figures`).catch(console.error);
        }
    
    }
};