class CommandSyntaxError extends Error {

    constructor(message) {
        super("Command syntax error: " + message);
        this.syntaxError = true;
    }

}

class CommandReader {
    
    constructor(message) {
        
        this.message = message;
        this.position = 0;

        const tokens = message.trim().split(/\s+/);
        if(tokens.length > 0) {
            this.command = tokens[0].slice(1);
            this.tokens = tokens.slice(1);
        } else {
            throw new CommandSyntaxError("No command to read!");
        }
    }

    peek() {
        return this.tokens[this.position];
    }

    readRest() {
        return this.tokens.slice(this.position);
    }

    readToken(fallback) {
        if(this.tokens.length <= this.position) {
            if(fallback) return fallback;
            throw new CommandSyntaxError("Unexpectedly reached end of input");
        }
        return this.tokens[this.position++];
    }

    readMention(fallback) {
        const parsed = this.readToken(fallback && `<@${fallback}>`).match(/<@!?(\d+)>/);
        if(!parsed) throw new CommandSyntaxError("Failed to parse user mention");
        return parsed[1];
    }

    readChannelMention(fallback) {
        const parsed = this.readToken(fallback && `<#${fallback}>`).match(/<#(\d+)>/);
        if(!parsed) throw new CommandSyntaxError("Failed to parse channel mention");
        return parsed[1];
    }

};

module.exports = {CommandReader, CommandSyntaxError};