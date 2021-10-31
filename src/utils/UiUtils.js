/**
 * 弹出 Element UI 的 confirm 对话框，返回用户是否确认
 * 
 * @param {object} self
 * @param {string} message
 * @param {string} title
 * @param {object} options
 * @returns {Promise<boolean>} 用户是否确认
 */
async function confirmAsync(self, message, title, options) {
    try {
        await self.$confirm(message, title, options);
    } catch {
        return false; // cancel
    }
    return true;
}

/**
 * 弹出确认删除对话框
 * 
 * @param {object} self
 * @param {string} message
 * @param {string} title
 * @returns {Promise<boolean>} 用户是否确认
 */
async function confirmDeleteAsync(self, message, title) {
    return await confirmAsync(self, message, title, {
        type: 'warning',
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
    });
}

export { confirmAsync, confirmDeleteAsync };
