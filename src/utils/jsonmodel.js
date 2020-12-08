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
    static ROLE_SUPER_ADMIN = 'SuperAdmin';
    static ROLE_ADMIN = 'Admin';
    static ROLE_MEMBER = 'Member';
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
}

class ApiResponseJson {
    constructor() {
        /** @type {number} */
        this.type = null;
        /** @type {string} */
        this.message = null;
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
}
