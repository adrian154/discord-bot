// all those shitty fake rickroll sites
const blacklist = [
    "thisworldthesedays.com",
    "tomorrowtides.com",
    "theraleighregister.com",
    "sanfransentinel.com"
];

module.exports = {
    name: "rickrollalert",
    priority: 200,
    frequency: 1,
    handle: (bot, message) => {
        for(const phrase of blacklist) {
            if(message.content.includes(phrase)) {
                message.channel.send(":warning: **That link is potentially a rickroll. Click at your own risk.**").catch(console.error);
                return true;
            }
        }
    }
};