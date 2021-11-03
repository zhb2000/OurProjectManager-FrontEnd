class UserJson {
    constructor() {
        /** @type {number} */
        this.id = null;
        /** @type {string} */
        this.username = null;
        /** @type {string} */
        this.nickname = null;
        /** @type {string} */
        this.createAt = null;
        /** @type {string} */
        this.updateAt = null;
        /** @type {string} */
        this.projectCount = null;
    }

    /** @param {object?} user */
    static convert(user) {
        if (user == null) { return; }
        Object.setPrototypeOf(user, UserJson.prototype);
    }
}

class NotificationJson {
    constructor() {
        /** @type {number} */
        this.id = null;
        /** @type {boolean} */
        this.read = null;
        /** @type {string} */
        this.title = null;
        /** @type {string} */
        this.body = null;
        /** @type {string} */
        this.createAt = null;
        /** @type {UserJson} */
        this.sender = null;
        /** @type {UserJson} */
        this.receiver = null;
    }

    /** @param {object?} notification */
    static convert(notification) {
        if (notification == null) { return; }
        UserJson.convert(notification.sender);
        UserJson.convert(notification.receiver);
        Object.setPrototypeOf(notification, NotificationJson.prototype);
    }
}

class ProjectJson {
    constructor() {
        /** @type {number} */
        this.id = null;
        /** @type {string} */
        this.name = null;
        /** @type {string} */
        this.description = null;
        /** @type {string} */
        this.createAt = null;
        /** @type {string} */
        this.updateAt = null;
        /** @type {UserJson} */
        this.superAdmin = null;
        /** @type {UserJson[]} */
        this.admins = null;
    }

    /** @param {object?} project */
    static convert(project) {
        if (project == null) { return; }
        UserJson.convert(project.superAdmin);
        project.admins.forEach(user => UserJson.convert(user));
        Object.setPrototypeOf(project, ProjectJson.prototype);
    }
}

class MemberJson {
    constructor() {
        /** @type {UserJson} */
        this.user = null;
        /** @type {string} */
        this.role = null;
        /** @type {string} */
        this.joinAt = null;
    }

    /** 项目主管 */
    static ROLE_SUPER_ADMIN = 'SuperAdmin';
    /** 项目管理员 */
    static ROLE_ADMIN = 'Admin';
    /** 普通成员 */
    static ROLE_MEMBER = 'Member';

    /** @param {object?} member */
    static convert(member) {
        if (member == null) { return; }
        UserJson.convert(member.user);
        Object.setPrototypeOf(member, MemberJson.prototype);
    }
}

class TaskJson {
    constructor() {
        /** @type {number} */
        this.id = null;
        /** @type {string} */
        this.title = null;
        /** @type {string} */
        this.body = null;
        /** @type {number} */
        this.commentNum = null;
        /** @type {string} */
        this.createAt = null;
        /** @type {UserJson} */
        this.creator = null;
        /** @type {UserJson[]} */
        this.executors = null;
        /** @type {boolean} */
        this.complete = null;
        /** @type {string} */
        this.completeAt = null;
        /** @type {UserJson} */
        this.completer = null;
    }

    /** @param {object?} task */
    static convert(task) {
        if (task == null) { return; }
        UserJson.convert(task.creator);
        task.executors.forEach(user => UserJson.convert(user));
        UserJson.convert(task.completer);
        Object.setPrototypeOf(task, TaskJson.prototype);
    }
}

class CommentJson {
    constructor() {
        /** @type {number} */
        this.id = null;
        /** @type {string} */
        this.body = null;
        /** @type {string} */
        this.createAt = null;
        /** @type {UserJson} */
        this.user = null;
    }

    /** @param {object?} comment */
    static convert(comment) {
        if (comment == null) { return; }
        UserJson.convert(comment.user);
        Object.setPrototypeOf(comment, CommentJson.prototype);
    }
}

class InvitationJson {
    constructor() {
        /** @type {number} */
        this.id = null;
        /** @type {string} */
        this.createAt = null;
        /** @type {string} */
        this.endAt = null;
        /** @type {string} */
        this.status = null;
        /** @type {UserJson} */
        this.sender = null;
        /** @type {UserJson} */
        this.receiver = null;
        /** @type {ProjectJson} */
        this.project = null;
    }

    static STATUS_CREATED = 'created';
    static STATUS_CANCELED = 'canceled';
    static STATUS_ACCEPTED = 'accepted';
    static STATUS_REJECTED = 'rejected';

    /** @param {object?} invitation */
    static convert(invitation) {
        if (invitation == null) { return; }
        UserJson.convert(invitation.sender);
        UserJson.convert(invitation.receiver);
        ProjectJson.convert(invitation.project);
        Object.setPrototypeOf(invitation, InvitationJson.prototype);
    }
}

class ApiResponseJson {
    constructor() {
        /** @type {number} */
        this.type = null;
        /** @type {string} */
        this.message = null;
    }

    /** @param {object?} response */
    static convert(response) {
        if (response == null) { return; }
        Object.setPrototypeOf(response, ApiResponseJson.prototype);
    }
}

export {
    UserJson,
    NotificationJson,
    ProjectJson,
    MemberJson,
    TaskJson,
    CommentJson,
    InvitationJson,
    ApiResponseJson
};
