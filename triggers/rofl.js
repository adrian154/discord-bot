module.exports = {
    name: "log",
    handle: (bot, message) => {
        if(message.content.includes("🤣")) {
            message.channel.send("EAT SHIT AND DIE").catch(console.error);
            return true;
        }
    }
};