module.exports = (path, defaultValue) => {
    try {
        return require(path);
    } catch(error) {
        if(defaultValue === undefined || defaultValue === null) {
            throw error;
        } else {
            console.log("WARNING: Missing datafile " + path);
            return defaultValue;
        }
    }
};