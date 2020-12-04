import { HttpStatus } from './HttpStatus.js'

class BusinessErrorType {
    /**
     * @param {string} type 错误类型
     * @param {number} status HTTP 响应代码
     */
    constructor(type, status) {
        this.type = type;
        this.status = status;
    }
}
/** 用户名或密码错误 */
BusinessErrorType.WRONG_PASSWORD_OR_USERNAME = new BusinessErrorType("WrongPasswordOrUsername", HttpStatus.UNAUTHORIZED);
/** 旧密码错误 */
BusinessErrorType.WRONG_OLD_PASSWORD = new BusinessErrorType("WrongOldPassword", HttpStatus.FORBIDDEN);
/** 同名用户已存在 */
BusinessErrorType.USER_ALREADY_EXIST = new BusinessErrorType("UserAlreadyExist", HttpStatus.CONFLICT);
/** 用户不存在 */
BusinessErrorType.USER_NOT_FOUND = new BusinessErrorType("UserNotFound", HttpStatus.NOT_FOUND);
/** 通知不存在 */
BusinessErrorType.NOTIFICATION_NOT_FOUND = new BusinessErrorType("NotificationNotFound", HttpStatus.NOT_FOUND);
/** 未登录 */
BusinessErrorType.NOT_LOGIN = new BusinessErrorType("NotLogin", HttpStatus.UNAUTHORIZED);
/** 没有权限 */
BusinessErrorType.PERMISSION_DENIED = new BusinessErrorType("PermissionDenied", HttpStatus.FORBIDDEN);
/** 项目不存在 */
BusinessErrorType.PROJECT_NOT_FOUND = new BusinessErrorType("ProjectNotFound", HttpStatus.NOT_FOUND);
/** 任务不存在 */
BusinessErrorType.TASK_NOT_FOUND = new BusinessErrorType("TaskNotFound", HttpStatus.NOT_FOUND);
/** 评论不存在 */
BusinessErrorType.COMMENT_NOT_FOUND = new BusinessErrorType("CommentNotFound", HttpStatus.NOT_FOUND);
/** 成员不存在 */
BusinessErrorType.MEMBER_NOT_FOUND = new BusinessErrorType("MemberNotFound", HttpStatus.NOT_FOUND);
/** 未知错误 */
BusinessErrorType.UNKNOWN_ERROR = new BusinessErrorType("UnknownError", HttpStatus.INTERNAL_SERVER_ERROR);
/** 邀请不存在 */
BusinessErrorType.INVITATION_NOT_FOUND = new BusinessErrorType("InvitationNotFound", HttpStatus.NOT_FOUND);
/** 邀请已存在 */
BusinessErrorType.INVITATION_ALREADY_EXIST = new BusinessErrorType("InvitationAlreadyExist", HttpStatus.CONFLICT);
/** 邀请接收者已在项目中 */
BusinessErrorType.RECEIVER_ALREADY_IN_PROJECT = new BusinessErrorType("ReceiverAlreadyInProject", HttpStatus.CONFLICT);

Object.freeze(BusinessErrorType);

/**
 * 检查异常中是否包含了业务异常
 * @param {*} error Axios 抛出的异常
 */
function containsBusinessError(error) {
    return error
        && error.response
        && error.response.status
        && error.response.data
        && error.response.data.type
        && error.response.data.message;
}

/**
 * 检查是否为指定的业务异常
 * @param {*} error 异常
 * @param {BusinessErrorType} businessErrorType 业务异常枚举
 * @returns {boolean}
 */
function responseErrorTest(error, businessErrorType) {
    if (!containsBusinessError(error)) {
        return false;
    }
    return error.response.status === businessErrorType.status
        && error.response.data.type === businessErrorType.type;
}

export { BusinessErrorType, responseErrorTest };
