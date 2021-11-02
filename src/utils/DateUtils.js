import { zeroPad } from './StringUtils';

/**
 * YYYY-MM-DD
 * @param {Date} date 
 */
function dateToDayStr(date) {
    return new Date(date).toJSON().slice(0, 10);
}

/**
 * 
 * @param {Date | string} date 
 */
function beautify(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hour = d.getHours();
    const minute = d.getMinutes();
    return `${year}-${zeroPad(month, 2)}-${zeroPad(day, 2)} ` +
        `${zeroPad(hour, 2)}:${zeroPad(minute, 2)}`;
}

export { dateToDayStr, beautify };
