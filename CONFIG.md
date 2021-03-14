* `config.json`
    * `debug`: Boolean - when enabled, changes various bot behaviors
        * The webend will be configured to serve Minecraft server favicons over HTTP and not HTTPS. See README.md for remarks on HTTP/HTTPS
    * `bot`:
        * `cmdPrefix`: Character that comes before commands. Note that whenever a command is referenced in a bot message, the default command prefix (`$`) is hardcoded. However, this doesn't affect bot function.
        * `token`: The bot's Discord token.
        * `owner`: The superuser's Discord account ID. This user has access to all privileged commands.
        * `owoifyFrequency`: How often the `towoify` trigger fires.
    * `serverDB`:
        * `path`: The path to the bot's SQLite database.
        * `defaultPermissions`: The default permissions tree for all servers.
    * `mc`:
        * `host`: The Minecraft server's hostname.
        * `port`: The Minecraft server's port.
        * `token`: The secret token used to authenticate the bot with the Minecraft server.
    * `web`:
        * `hostname`: The hostname which the built-in favicon server can be accessed through.
        * `port`: The port which the favicon server is hosted on.