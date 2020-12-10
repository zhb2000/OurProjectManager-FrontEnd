import axios from 'axios';
import {
    CommentJson,
    InvitationJson,
    MemberJson,
    NotificationJson,
    ProjectJson,
    TaskJson,
    UserJson
} from './jsonmodel';

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
 * 获取当前用户在项目内的角色
 * @param {number | string} projectId
 * @returns {Promise<string>} 若用户不在项目内则返回 null
 */
async function getCurrentRoleAsync(projectId) {
    const isMember = await getIsMemberAsync(projectId);
    if (!isMember) {
        return null;
    }
    const currentUserId = await getCurrentUserIdAsync();
    const member = await getMemberAsync(projectId, currentUserId);
    return member.role;
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

/**
 * @param {number | string} projectId 
 * @returns {Promise<TaskJson[]>}
 */
async function getTasksAsync(projectId) {
    const result = await axios.get(`/api/projects/${projectId}/tasks`);
    const tasks = result.data;
    for (let task of tasks) {
        Object.setPrototypeOf(task, TaskJson.prototype);
    }
    return tasks;
}

/**
 * @param {number | string} projectId 
 * @param {number | string} taskId 
 * @returns {Promise<TaskJson>}
 */
async function getTaskAsync(projectId, taskId) {
    const result = await axios.get(`/api/projects/${projectId}/tasks/${taskId}`);
    const task = result.data;
    Object.setPrototypeOf(task, TaskJson.prototype);
    return task;
}

/**
 * @param {number|string} projectId 
 */
async function getInvitationsAsync(projectId) {
    const result = await axios.get(`/api/projects/${projectId}/invitations`);
    const invitations = result.data;
    for (let invitation of invitations) {
        Object.setPrototypeOf(invitation, InvitationJson.prototype);
    }
    return invitations;
}

/**
 * @param {number|string} projectId 
 * @param {string} newName 
 * @param {string} newDescription 
 */
async function updateProjectNameAndDescriptionAsync(projectId, newName, newDescription) {
    await axios.patch(`/api/projects/${projectId}`,
        { name: newName, description: newDescription });
}

/**
 * @param {number|string} projectId 
 */
async function deleteProjectAsync(projectId) {
    await axios.delete(`/api/projects/${projectId}`);
}

/**
 * @param {number|string} projectId 
 * @param {string} title 
 * @param {string} body 
 * @param {UserJson[]} executors 
 * @returns {TaskJson} 创建的任务
 */
async function createTaskAsync(projectId, title, body, executors) {
    const result = await axios.post(`/api/projects/${projectId}/tasks`,
        { title, body, executors });
    const task = result.data;
    Object.setPrototypeOf(task, TaskJson.prototype);
    return task;
}

/**
 * @param {number|string} projectId 
 * @param {number|string} taskId 
 * @returns {CommentJson[]}
 */
async function getCommentsAsync(projectId, taskId) {
    const result = await axios.get(
        `/api/projects/${projectId}/tasks/${taskId}/comments`);
    const comments = result.data;
    for (let comment of comments) {
        Object.setPrototypeOf(comment, CommentJson.prototype);
    }
    return comments;
}

/**
 * @param {number|string} projectId 
 * @param {number|string} taskId 
 * @param {string} body 
 * @returns {Promise<CommentJson>}
 */
async function createCommentAsync(projectId, taskId, body) {
    const result = await axios.post(
        `/api/projects/${projectId}/tasks/${taskId}/comments`, { body });
    const comment = result.data;
    Object.setPrototypeOf(comment, CommentJson.prototype);
    return comment;
}

/**
 * @param {number|string} projectId 
 * @param {number|string} taskId 
 * @param {number|string} commentId 
 */
async function deleteCommentsAsync(projectId, taskId, commentId) {
    await axios.delete(
        `/api/projects/${projectId}/tasks/${taskId}/comments/${commentId}`);
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
    getMembersAsync,
    getCurrentRoleAsync,
    getProjectAsync,
    getTasksAsync,
    getTaskAsync,
    getInvitationsAsync,
    updateProjectNameAndDescriptionAsync,
    deleteProjectAsync,
    createTaskAsync,
    getCommentsAsync,
    createCommentAsync,
    deleteCommentsAsync,
    CURRENT_USERNAME_KEY,
    JWT_TOKEN_KEY
};
