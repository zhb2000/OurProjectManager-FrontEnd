import axios from 'axios';
import {
    CommentJson,
    InvitationJson,
    MemberJson,
    NotificationJson,
    ProjectJson,
    TaskJson,
    UserJson
} from './JsonModel';

const CURRENT_USERNAME_KEY = 'CURRENT_USERNAME';
const JWT_TOKEN_KEY = 'JWT_TOKEN';

/**
 * 请求 /api/whoami 获取当前用户的 JSON
 * @returns {Promise<UserJson>}
 * @throws
 */
async function getWhoamiUserAsync() {
    const result = await axios.get('/api/whoami');
    const user = result.data;
    UserJson.convert(user);
    return user;
}

/**
 * 请求 /api/whoami 获取当前用户的用户名
 * @returns {Promise<string>}
 * @throws
 */
async function getWhoamiUsernameAsync() {
    return (await getWhoamiUserAsync()).username;
}

/**
 * 获取当前用户名
 * 
 * 若 session storage 有则取出，否则请求 /api/whoami 获取
 * @returns {Promise<string>}
 * @throws
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
 * @returns {Promise<number>}
 * @throws
 */
async function getCurrentUserIdAsync() {
    return (await getWhoamiUserAsync()).id;
}

/**
 * 登录
 * 
 * 若登录成功，则设置 local storage 和 session storage
 * @param {string} username
 * @param {string} password
 * @throws
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
 * @throws
 */
async function logoutAsync() {
    await axios.get("/api/logout");
    clearStorage();
}

/**
 * 创建项目，并获取该项目的 JSON
 * @param {string} name 
 * @param {string} description 
 * @returns {Promise<ProjectJson>} 创建的项目
 * @throws
 */
async function createProjectAsync(name, description) {
    const result = await axios.post('/api/projects', { name, description });
    const project = result.data;
    ProjectJson.convert(project);
    return project;
}

/**
 * @param {string} username 
 * @returns {Promise<UserJson>}
 * @throws
 */
async function getUserByNameAsync(username) {
    const result = await axios.get(`/api/users/${encodeURIComponent(username)}`);
    const user = result.data;
    UserJson.convert(user);
    return user;
}

/**
 * 获取用户参加的项目
 * @param {string} username 
 * @returns {Promise<ProjectJson[]>}
 * @throws
 */
async function getUserProjectsAsync(username) {
    const result = await axios.get(
        `/api/users/${encodeURIComponent(username)}/projects`);
    /** @type {Array} */
    const projects = result.data;
    projects.forEach(project => ProjectJson.convert(project));
    return projects;
}

/**
 * 获取用户收到的通知
 * @param {string} username 
 * @returns {Promise<NotificationJson[]>}
 * @throws
 */
async function getRecvNotificationsAsync(username) {
    const result = await axios.get(
        `/api/users/${encodeURIComponent(username)}/notifications/recv`);
    /** @type {Array} */
    const recvNotifications = result.data;
    recvNotifications.forEach(
        notification => NotificationJson.convert(notification));
    return recvNotifications;
}

/**
 * 获取用户发送的通知
 * @param {string} username 
 * @returns {Promise<NotificationJson[]>}
 * @throws
 */
async function getSendNotificationsAsync(username) {
    const result = await axios.get(
        `/api/users/${encodeURIComponent(username)}/notifications/send`);
    /** @type {Array} */
    const sendNotifications = result.data;
    sendNotifications.forEach(
        notification => NotificationJson.convert(notification));
    return sendNotifications;
}

/**
 * @param {string} receiverUsername
 * @param {string} title
 * @param {string} body
 * @throws
 */
async function createNotificationAsync(receiverUsername, title, body) {
    await axios.post(
        `/api/users/${encodeURIComponent(receiverUsername)}/notifications`,
        { title, body });
}

/**
 * @param {string} username 
 * @param {number} notificationId 
 * @param {boolean} read 
 * @throws
 */
async function updateNotificationReadAsync(username, notificationId, read) {
    await axios.patch(
        `/api/users/${encodeURIComponent(username)}/notifications/${notificationId}`,
        { read });
}

/**
 * 更新用户名和昵称
 * @param {string} username 
 * @param {string} newUsername 
 * @param {string} newNickname 
 * @throws
 */
async function updateUsernameAndNicknameAsync(username, newUsername, newNickname) {
    await axios.put(
        `/api/users/${encodeURIComponent(username)}`,
        { username: newUsername, nickname: newNickname });
}

/**
 * 更新密码
 * @param {string} username 
 * @param {string} oldPassword 
 * @param {string} newPassword 
 * @throws
 */
async function updatePasswordAsync(username, oldPassword, newPassword) {
    await axios.put(
        `/api/users/${encodeURIComponent(username)}/password`,
        { oldPassword, newPassword });
}

/**
 * 注销用户账户
 * @param {string} username 
 * @throws
 */
async function deleteUserAsync(username) {
    await axios.delete(`/api/users/${encodeURIComponent(username)}`);
}

/**
 * 获取项目内成员列表
 * @param {number} projectId 
 * @returns {Promise<MemberJson[]>}
 * @throws
 */
async function getMembersAsync(projectId) {
    const result = await axios.get(`/api/projects/${projectId}/members`);
    /** @type {Array} */
    const members = result.data;
    members.forEach(member => MemberJson.convert(member));
    return members;
}

/**
 * 获取某用户在项目内的成员信息
 * @param {number} projectId 
 * @param {number} userId 
 * @returns {Promise<MemberJson>}
 * @throws
 */
async function getMemberAsync(projectId, userId) {
    const result = await axios.get(`/api/projects/${projectId}/members/${userId}`);
    const member = result.data;
    MemberJson.convert(member);
    return member;
}

/**
 * 将某用户移出项目
 * @param {number} projectId 
 * @param {number} userId 
 * @throws
 */
async function deleteMemberAsync(projectId, userId) {
    await axios.delete(`/api/projects/${projectId}/members/${userId}`);
}

/**
 * 当前用户是否为项目成员
 * @param {number} projectId 
 * @returns {Promise<boolean>}
 * @throws
 */
async function getIsMemberAsync(projectId) {
    const result = await axios.get(`/api/projects/${projectId}/ismember`);
    return result.data;
}

/**
 * 获取当前用户在项目内的角色
 * @param {number} projectId
 * @returns {Promise<string>} 若用户不在项目内则返回 null
 * @throws
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
 * 更新成员角色
 * @param {number} projectId
 * @param {MemberJson} member 
 * @throws
 */
async function updateMemberAsync(projectId, member) {
    const userId = member.user.id;
    await axios.patch(`/api/projects/${projectId}/members/${userId}`, member);
}

/**
 * 获取项目
 * @param {number} projectId 
 * @returns {Promise<ProjectJson>}
 * @throws
 */
async function getProjectAsync(projectId) {
    const result = await axios.get(`/api/projects/${projectId}`);
    const project = result.data;
    ProjectJson.convert(project);
    return project;
}

/**
 * 获取任务列表
 * @param {number} projectId 
 * @returns {Promise<TaskJson[]>}
 * @throws
 */
async function getTasksAsync(projectId) {
    const result = await axios.get(`/api/projects/${projectId}/tasks`);
    /** @type {Array} */
    const tasks = result.data;
    tasks.forEach(task => TaskJson.convert(task));
    return tasks;
}

/**
 * 获取任务内容
 * @param {number} projectId 
 * @param {number} taskId 
 * @returns {Promise<TaskJson>}
 * @throws
 */
async function getTaskAsync(projectId, taskId) {
    const result = await axios.get(`/api/projects/${projectId}/tasks/${taskId}`);
    const task = result.data;
    TaskJson.convert(task);
    return task;
}

/**
 * 更新任务的标题、内容、执行人
 * @param {number} projectId 
 * @param {TaskJson} task 
 * @throws
 */
async function updateTaskAsync(projectId, task) {
    const taskId = task.id;
    await axios.put(`/api/projects/${projectId}/tasks/${taskId}`, task);
}

/**
 * 更新任务的完成状态
 * @param {number} projectId 
 * @param {number} taskId 
 * @param {boolean} complete 
 * @throws
 */
async function updateTaskCompleteAsync(projectId, taskId, complete) {
    await axios.patch(`/api/projects/${projectId}/tasks/${taskId}`, { complete });
}

/**
 * 删除任务
 * @param {number} projectId 
 * @param {number} taskId 
 * @throws
 */
async function deleteTaskAsync(projectId, taskId) {
    await axios.delete(`/api/projects/${projectId}/tasks/${taskId}`);
}

/**
 * 获取邀请列表
 * @param {number} projectId 
 * @returns {Promise<InvitationJson[]>}
 * @throws
 */
async function getInvitationsAsync(projectId) {
    const result = await axios.get(`/api/projects/${projectId}/invitations`);
    /** @type {Array} */
    const invitations = result.data;
    invitations.forEach(invitation => InvitationJson.convert(invitation));
    return invitations;
}

/**
 * 获取邀请信息
 * @param {number} projectId 
 * @param {number} invitationId 
 * @returns {Promise<InvitationJson>}
 * @throws
 */
async function getInvitationAsync(projectId, invitationId) {
    const result = await axios.get(
        `/api/projects/${projectId}/invitations/${invitationId}`);
    const invitation = result.data;
    InvitationJson.convert(invitation);
    return invitation;
}

/**
 * 取消邀请
 * @param {number} projectId 
 * @param {number} invitationId 
 * @throws
 */
async function cancelInvitationAsync(projectId, invitationId) {
    await axios.get(
        `/api/projects/${projectId}/invitations/${invitationId}/cancel`);
}

/**
 * 接受邀请
 * @param {number} projectId 
 * @param {number} invitationId 
 * @throws
 */
async function acceptInvitationAsync(projectId, invitationId) {
    await axios.get(
        `/api/projects/${projectId}/invitations/${invitationId}/accept`);
}

/**
 * 拒绝邀请
 * @param {number} projectId 
 * @param {number} invitationId 
 * @throws
 */
async function rejectInvitationAsync(projectId, invitationId) {
    await axios.get(
        `/api/projects/${projectId}/invitations/${invitationId}/reject`);
}

/**
 * 创建邀请
 * @param {number} projectId 
 * @param {UserJson} receiver 
 * @returns {Promise<InvitationJson>}
 * @throws
 */
async function createInvitationAsync(projectId, receiver) {
    const result = await axios.post(
        `/api/projects/${projectId}/invitations`,
        { receiver });
    const invitation = result.data;
    InvitationJson.convert(invitation);
    return invitation;
}

/**
 * 更新项目名称和项目描述
 * @param {number} projectId 
 * @param {string} newName 
 * @param {string} newDescription 
 * @throws
 */
async function updateProjectNameAndDescriptionAsync(projectId, newName, newDescription) {
    await axios.patch(`/api/projects/${projectId}`,
        { name: newName, description: newDescription });
}

/**
 * 删除项目
 * @param {number} projectId 
 * @throws
 */
async function deleteProjectAsync(projectId) {
    await axios.delete(`/api/projects/${projectId}`);
}

/**
 * 创建任务
 * @param {number} projectId 
 * @param {string} title 
 * @param {string} body 
 * @param {UserJson[]} executors 
 * @returns {Promise<TaskJson>} 创建的任务
 * @throws
 */
async function createTaskAsync(projectId, title, body, executors) {
    const result = await axios.post(`/api/projects/${projectId}/tasks`,
        { title, body, executors });
    const task = result.data;
    TaskJson.convert(task);
    return task;
}

/**
 * 获取任务列表
 * @param {number} projectId 
 * @param {number} taskId 
 * @returns {Promise<CommentJson[]>}
 * @throws
 */
async function getCommentsAsync(projectId, taskId) {
    const result = await axios.get(
        `/api/projects/${projectId}/tasks/${taskId}/comments`);
    /** @type {Array} */
    const comments = result.data;
    comments.forEach(comment => CommentJson.convert(comment));
    return comments;
}

/**
 * 创建评论
 * @param {number} projectId 
 * @param {number} taskId 
 * @param {string} body 
 * @returns {Promise<CommentJson>}
 * @throws
 */
async function createCommentAsync(projectId, taskId, body) {
    const result = await axios.post(
        `/api/projects/${projectId}/tasks/${taskId}/comments`, { body });
    const comment = result.data;
    CommentJson.convert(comment);
    return comment;
}

/**
 * 删除评论
 * @param {number} projectId 
 * @param {number} taskId 
 * @param {number} commentId 
 * @throws
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
    createNotificationAsync,
    updateNotificationReadAsync,
    updateUsernameAndNicknameAsync,
    updatePasswordAsync,
    deleteUserAsync,
    clearStorage,
    getMembersAsync,
    updateMemberAsync,
    deleteMemberAsync,
    getCurrentRoleAsync,
    getProjectAsync,
    getTasksAsync,
    getTaskAsync,
    updateTaskAsync,
    updateTaskCompleteAsync,
    deleteTaskAsync,
    getInvitationsAsync,
    getInvitationAsync,
    cancelInvitationAsync,
    acceptInvitationAsync,
    rejectInvitationAsync,
    createInvitationAsync,
    updateProjectNameAndDescriptionAsync,
    deleteProjectAsync,
    createTaskAsync,
    getCommentsAsync,
    createCommentAsync,
    deleteCommentsAsync,
    CURRENT_USERNAME_KEY,
    JWT_TOKEN_KEY
};
