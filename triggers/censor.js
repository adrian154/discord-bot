const Profanity = {
    fuck: "f*ck",
    shit: "sh*t",
    heck: "h*ck",
    asshole: "assh*le",
    penis: "p*nis",
    dick: "d*ck",
    bitch: "b*tch",
    piss: "p*ss",
    cunt: "c*nt",
    tits: "t*ts"
};

module.exports = {
    name: "censor",
    priority: 5,
    frequency: 0.01,
    handle: (bot, message) => {
        for(const swearWord in Profanity) {
            if(message.content.includes(swearWord)) {
                message.channel.send().catch(console.error);
                return true;
            }
        }
    }
};