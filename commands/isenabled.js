module.exports = {
    name: "enabled",
    description: "Checks if a feature is enabled",
    privileged: true,
    usage: "isenabled <feature>",
    handle: async (bot, message, tokens) => {

        if(tokens.length != 1) {
            message.channel.send("Not enough parameters.").catch(console.error);
            return;
        }

        const featureName = tokens[0];
        message.channel.send(`\`${featureName}\` is ${bot.featureEnabled(featureName, message.guild) ? "ENABLED" : "DISABLED"}`)

    }
};