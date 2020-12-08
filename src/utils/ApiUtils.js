import axios from 'axios';

const CURRENT_USERNAME_KEY = 'CURRENT_USERNAME';
const JWT_TOKEN_KEY = 'JWT_TOKEN';

/**
 * 请求 /api/whoami 获取当前用户的 JSON
 */
async function getWhoamiUserAsync() {
    const result = await axios.get('/api/whoami');
    return result.data;
}

/**
 * 请求 /api/whoami 获取当前用户的用户名
 * @returns {Promise<string>} 当前用户名
 */
async function getWhoamiUsernameAsync() {
    return (await getWhoamiUserAsync()).username;
}

/**
 * 获取当前用户名
 * 
 * 若 session storage 有则取出，否则请求 /api/whoami 获取
 */
async function getCurrentUsernameAsync() {
    let currentUsername = sessionStorage.getItem(CURRENT_USERNAME_KEY);
    if (!currentUsername) {
        currentUsername = await getWhoamiUsernameAsync();
        sessionStorage.setItem(CURRENT_USERNAME_KEY, currentUsername);
    }
    return currentUsername;
}

/**
 * 登录
 * 
 * 若登录成功，则设置 local storage 和 session storage
 * 
 * @param {string} username
 * @param {string} password
 */
async function loginAsync(username, password) {
    const result = await axios.post('/api/login', { username, password });
    const token = result.data;
    localStorage.setItem(JWT_TOKEN_KEY, token);
    sessionStorage.setItem(CURRENT_USERNAME_KEY, username);
}

/**
 * 登出
 * 
 * 登出后会清除 local storage 和 session storage 中的字段
 */
async function logoutAsync() {
    await axios.get("/api/logout");
    localStorage.removeItem(JWT_TOKEN_KEY);
    sessionStorage.removeItem(CURRENT_USERNAME_KEY);
}

export {
    getCurrentUsernameAsync,
    loginAsync,
    logoutAsync,
    CURRENT_USERNAME_KEY,
    JWT_TOKEN_KEY
}
