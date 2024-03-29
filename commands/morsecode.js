module.exports = {
    name: "morse",
    description: "Converts a message to morse code",
    args: "<message>",
    handle: (bot, message, reader) => {
        
        message.reply("`" + reader.tokens.join(" ").toUpperCase().split("").map(char => ({
            "A": "•–",
            "B": "–•••",
            "C": "–•–•",
            "D": "–••",
            "E": "•",
            "F": "••–•",
            "G": "––•",
            "H": "••••",
            "I": "••",
            "J": "•–––",
            "K": "–•–",
            "L": "•–••",
            "M": "––",
            "N": "–•",
            "O": "–––",
            "P": "•––•",
            "Q": "––•–",
            "R": "•–•",
            "S": "•••",
            "T": "–",
            "U": "••–",
            "V": "•••–",
            "W": "•––",
            "X": "–••–",
            "Y": "–•––",
            "Z": "––••",
            "1": "•––––",
            "2": "••–––",
            "3": "•••––",
            "4": "••••–",
            "5": "•••••",
            "6": "–••••",
            "7": "––•••",
            "8": "–––••",
            "9": "––––•",
            "0": "–––––",
            " ": "/"
        })[char] || "").join(" ") + "`").catch(console.error);

    }
};