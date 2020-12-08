class StringUtils {
    /** 检查是否为字符串 */
    static isString(s) {
        return typeof s === "string" || s instanceof String;
    }
    /** 
     * 检查字符串是否为空
     * 
     * 包括：空串、null、undefined
     */
    static isEmpty(s) {
        if (s === null || s === undefined) {
            return true;
        }
        return s.toString().trim().length === 0;
    }
}

Object.freeze(StringUtils);

export { StringUtils };
