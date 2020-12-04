class StringUtils {
    static isString(s) {
        return typeof s === "string" || s instanceof String;
    }
    static isEmpty(s) {
        if (s === null || s === undefined) {
            return true;
        }
        return s.toString().trim().length === 0;
    }
}

Object.freeze(StringUtils);

export { StringUtils };
