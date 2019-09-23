const ErrorCodes = Object.freeze({
    EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
    INVALID_EMAIL: 'auth/invalid-email',
    OPERATION_NOT_ALLOWED: 'auth/operation-not-allowed',
    WEAK_PASSWORD: 'auth/weak-password',
    USER_DISABLED: 'auth/user-disabled',
    USER_NOT_FOUND: 'auth/user-not-found',
    WRONG_PASSWORD: 'auth/wrong-password'
})

export default ErrorCodes;