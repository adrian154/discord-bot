const evaluate = tokens => {

    const stack = [];
    for(const token of tokens) {
        if("+-*/".includes(token)) {
            if(stack.length < 2) throw new Error("not enough operands on stack");
            const op1 = stack.pop();
            const op0 = stack.pop();
            if(token === "+") {
                stack.push(op0 + op1);
            } else if(token === "-") {
                stack.push(op0 - op1)
            } else if(token === "*") {
                stack.push(op0 * op1);
            } else if(token === "/") {
                stack.push(op0 / op1);
            }
        } else {
            const value = Number(token);
            if(isNaN(value)) {
                throw new Error(`invalid token "${token}"`);
            } else {
                stack.push(value);
            }
        }
    }

    return stack.join(" ");

};
module.exports = {
    name: "calc",
    description: "Calculates an expression written in reverse Polish notation",
    args: "<expression>",
    handle: (bot, message, tokens) => {
        try {
            message.channel.send("Result: `" + evaluate(tokens) + "`").catch(console.error);
        } catch(error) {
            message.channel.send("Evaluation failed: `" + error.message + "`");
        }
        return true;
    }
};