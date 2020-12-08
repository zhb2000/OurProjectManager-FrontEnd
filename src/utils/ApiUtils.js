import axios from 'axios';

/**
 * 从 /api/whoami 获取当前用户的 JSON
 */
async function getWhoamiUserAsync() {
    const result = await axios.get('/api/whoami');
    return result.data;
}

/**
 * 从 /api/whoami 获取当前用户的用户名
 * @returns {Promise<string>} 当前用户名
 */
async function getWhoamiUsernameAsync() {
    return (await getWhoamiUserAsync()).username;
}

/**
 * 获取当前用户名
 */
async function getCurrentUsernameAsync() {
    const ITEM_KEY = 'CURRENT_USERNAME';
    let currentUsername = sessionStorage.getItem(ITEM_KEY);
    if (!currentUsername) {
        currentUsername = await getWhoamiUsernameAsync();
        sessionStorage.setItem(ITEM_KEY, currentUsername);
    }
    return currentUsername;
}

export { getCurrentUsernameAsync }
