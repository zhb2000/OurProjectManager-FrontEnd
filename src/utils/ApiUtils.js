import axios from 'axios';
import { MemberJson, NotificationJson, ProjectJson, UserJson } from './jsonmodel';

const CURRENT_USERNAME_KEY = 'CURRENT_USERNAME';
const JWT_TOKEN_KEY = 'JWT_TOKEN';

/**
 * 请求 /api/whoami 获取当前用户的 JSON
 * @returns {Promise<UserJson>}
 */
async function getWhoamiUserAsync() {
    const result = await axios.get('/api/whoami');
    const user = result.data;
    Object.setPrototypeOf(user, UserJson.prototype);
    return user;
}

/**
 * 请求 /api/whoami 获取当前用户的用户名
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
 * 获取当前用户 id
 */

async function getCurrentUserIdAsync() {
    return (await getWhoamiUserAsync()).id;
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
 * 清除 local storage 和 session storage 中的字段
 */
function clearStorage() {
    localStorage.removeItem(JWT_TOKEN_KEY);
    sessionStorage.removeItem(CURRENT_USERNAME_KEY);
}

/**
 * 登出
 * 
 * 登出后会清除 local storage 和 session storage 中的字段
 */
async function logoutAsync() {
    await axios.get("/api/logout");
    clearStorage();
}

/**
 * 创建项目，并获取该项目的 JSON
 * 
 * @param {string} name 
 * @param {string} description 
 * @returns {Promise<ProjectJson>} 创建的项目
 */
async function createProjectAsync(name, description) {
    const result = await axios.post('/api/projects', { name, description });
    const project = result.data;
    Object.setPrototypeOf(project, ProjectJson.prototype);
    return project;
}

/**
 * @param {string} username 
 * @returns {Promise<UserJson>}
 */
async function getUserByNameAsync(username) {
    const result = await axios.get(`/api/users/${username}`);
    const user = result.data;
    Object.setPrototypeOf(user, UserJson.prototype);
    return user;
}

/**
 * 获取用户参加的项目
 * @param {string} username 
 * @returns {Promise<ProjectJson[]>}
 */
async function getUserProjectsAsync(username) {
    const result = await axios.get(`/api/users/${username}/projects`);
    const projects = result.data;
    for (let project of projects) {
        Object.setPrototypeOf(project, ProjectJson.prototype);
    }
    return projects;
}

/**
 * 获取用户收到的通知
 * @param {string} username 
 * @returns {Promise<NotificationJson[]>}
 */
async function getRecvNotificationsAsync(username) {
    const result = await axios.get(`/api/users/${username}/recvNotifications`);
    const recvNotifications = result.data;
    for (let notification of recvNotifications) {
        Object.setPrototypeOf(notification, NotificationJson.prototype);
    }
    return recvNotifications;
}

/**
 * 获取用户发送的通知
 * @param {string} username 
 * @returns {Promise<NotificationJson[]>}
 */
async function getSendNotificationsAsync(username) {
    const result = await axios.get(`/api/users/${username}/sendNotifications`);
    const sendNotifications = result.data;
    for (let notification of sendNotifications) {
        Object.setPrototypeOf(notification, NotificationJson.prototype);
    }
    return sendNotifications;
}

/**
 * 更新用户名和昵称
 * @param {string} username 
 * @param {string} newUsername 
 * @param {string} newNickname 
 */
async function updateUsernameAndNicknameAsync(username, newUsername, newNickname) {
    await axios.put(`/api/users/${username}`,
        { username: newUsername, nickname: newNickname });
}

/**
 * 更新密码
 * @param {string} username 
 * @param {string} oldPassword 
 * @param {string} newPassword 
 */
async function updatePasswordAsync(username, oldPassword, newPassword) {
    await axios.put(`/api/users/${username}/password`, { oldPassword, newPassword });
}

/**
 * 注销用户账户
 * @param {string} username 
 */
async function deleteUserAsync(username) {
    await axios.delete(`/api/users/${username}`);
}

/**
 * 获取项目内成员列表
 * @param {number | string} projectId 
 * @returns {Promise<MemberJson[]>}
 */
async function getMembersAsync(projectId) {
    const result = await axios.get(`/api/projects/${projectId}/members`);
    const members = result.data;
    for (let member of members) {
        Object.setPrototypeOf(member, MemberJson.prototype);
    }
    return members;
}

/**
 * 获取某用户在项目内的成员
 * @param {number | string} projectId 
 * @param {number | string} userId 
 * @returns {Promise<MemberJson>}
 */
async function getMemberAsync(projectId, userId) {
    const result = await axios.get(`/api/projects/${projectId}/members/${userId}`);
    const member = result.data;
    Object.setPrototypeOf(member, MemberJson.prototype);
    return member;
}

/**
 * 当前用户是否为项目成员
 * @param {number | string} projectId 
 * @returns {Promise<boolean>}
 */
async function getIsMemberAsync(projectId) {
    const result = await axios.get(`/api/projects/${projectId}/ismember`);
    return result.data;
}

/**
 * @param {number | string} projectId 
 * @returns {Promise<ProjectJson>}
 */
async function getProjectAsync(projectId) {
    const result = await axios.get(`/api/projects/${projectId}`);
    const project = result.data;
    Object.setPrototypeOf(project, ProjectJson.prototype);
    return project;
}

export {
    getCurrentUsernameAsync,
    getCurrentUserIdAsync,
    loginAsync,
    logoutAsync,
    createProjectAsync,
    getUserByNameAsync,
    getUserProjectsAsync,
    getRecvNotificationsAsync,
    getSendNotificationsAsync,
    updateUsernameAndNicknameAsync,
    updatePasswordAsync,
    deleteUserAsync,
    clearStorage,
    getMemberAsync,
    getMembersAsync,
    getIsMemberAsync,
    getProjectAsync,
    CURRENT_USERNAME_KEY,
    JWT_TOKEN_KEY
}
