module.exports = {
    name: "getuser",
    description: "Get a user by user ID",
    args: "<user ID>",
    privileged: true,
    handle: async (bot, message, reader) => {

        const user = await bot.bot.users.fetch(reader.readToken());
        message.reply(user.tag).catch(console.error);

    }
};