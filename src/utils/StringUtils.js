/** 
 * 检查是否为字符串
 * @returns {boolean}
 */
function isString(s) {
    return typeof s === 'string' || s instanceof String;
}

/** 
 * 字符串是否为“空”
 * 
 * 包括：空串、null、undefined
 * @returns {boolean}
 */
function isEmpty(s) {
    if (s === null || s === undefined) {
        return true;
    }
    return s.toString().trim().length === 0;
}

/** @return {boolean} */
function notEmpty(s) {
    return !isEmpty(s);
}

/**
 * 将数字转为字符串并填充前导 0 直到指定宽度
 * @param {number} number 数字
 * @param {number} targetLength 指定宽度
 * @returns {string}
 */
function zeroPad(number, targetLength) {
    return number.toString().padStart(targetLength, '0');
}

/**
 * 名字的第一个字符，若名字为空则返回空格
 * @param {string | null | undefined} name 名字
 * @returns {string}
 */
function firstCharOfName(name) {
    const s = (name != null) ? name.trim() : name;
    return notEmpty(s) ? s[0] : ' ';
}

/**
 * 不区分大小写地判断是否包含某子串
 * @param {string} text 
 * @param {string} searchString 
 * @returns {boolean}
 */
function includeIgnoreCase(text, searchString) {
    return text.toLowerCase().includes(searchString.toLowerCase());
}

export {
    isString,
    isEmpty,
    notEmpty,
    zeroPad,
    firstCharOfName,
    includeIgnoreCase
};
