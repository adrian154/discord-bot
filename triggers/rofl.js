module.exports = {
    name: "log",
    handle: (bot, message) => {
        if(message.content.includes("🤣")) {
            message.channel.send("woww, you are so funny!").catch(console.error);
            return true;
        }
    }
};