module.exports = {
    wildcardToRegex: pattern => new RegExp("^" + pattern.split("*").join(".*") + "$"),
    datafile: (path, defaultValue) => {
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
    }
};