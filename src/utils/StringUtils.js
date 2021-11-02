/** 检查是否为字符串 */
function isString(s) {
    return typeof s === 'string' || s instanceof String;
}

/** 
 * 字符串是否为“空”
 * 
 * 包括：空串、null、undefined
 */
function isEmpty(s) {
    if (s === null || s === undefined) {
        return true;
    }
    return s.toString().trim().length === 0;
}

function notEmpty(s) {
    return !isEmpty(s);
}

/**
 * 
 * @param {number} number 
 * @param {number} targetLength 
 */
function zeroPad(number, targetLength) {
    return number.toString().padStart(targetLength, '0');
}

export { isString, isEmpty, notEmpty, zeroPad };
