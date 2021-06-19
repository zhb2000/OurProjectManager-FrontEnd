/**
 * Get integer in [min, max)
 * @param {number} min 
 * @param {number} max 
 * @returns {number} integer in [min, max)
 */
function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    //The maximum is exclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * @param {number} probability
 * @returns {boolean}
 */
function randBoolean(probability) {
    return Math.random() < probability;
}

/**
 * YYYY-MM-DD
 * @param {Date} date 
 */
function dateToDayStr(date) {
    return new Date(date).toJSON().slice(0, 10);
}

export {
    randInt,
    randBoolean,
    dateToDayStr
}
