module.exports = {
    name: "rofl",
    frequency: 1,
    handle: (bot, message) => {
        if(message.content.includes("🤣")) {
            message.channel.send("woww, you are so funny!").catch(console.error);
            return true;
        }
    }
};