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
    name: "sf",
    description: "Counts the number of significant figures in a number",
    args: "<number>",
    handle: (bot, message, tokens) => {

        if(tokens.length < 1) {
            return false;
        }

        if(!Number(tokens[0])) {
            message.reply("Invalid number.").catch(console.error);
        } else {
            message.reply(`${tokens[0]} has ${countSigFigs(tokens[0])} significant figures`).catch(console.error);
        }
        
        return true;

    }
};