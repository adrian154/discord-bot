module.exports = {
    pick: array => array[Math.floor(Math.random() * array.length)],
    datafile: (path, defaultValue) => {
        try {
            return require(path);
        } catch(error) {
            if(defaultValue === undefined || defaultValue === null) {
                throw error;
            } else {
                console.log(`WARNING: missing datafile ${path}, using fallback value`);
                return defaultValue;
            }
        }
    }
};