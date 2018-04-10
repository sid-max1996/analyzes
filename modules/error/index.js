const http = require('http');

class HttpError extends Error {
    constructor(status, message) {
        super(arguments);
        this.status = status;
        this.message = message || http.STATUS_CODES[status] || "Error";
    }
}

HttpError.name = 'HttpError';
exports.HttpError = HttpError;

class AuthError extends Error {
    constructor(message) {
        super(arguments);
        this.message = message || "Error";
    }
}

AuthError.name = 'AuthError';
exports.AuthError = AuthError;

class AccessError extends Error {
    constructor(message, isServerError = false) {
        super(arguments);
        this.message = message || "Error";
        this.isServerError = isServerError;
    }
}

AccessError.name = 'AccessError';
exports.AccessError = AccessError;

class SessionError extends Error {
    constructor(message) {
        super(arguments);
        this.message = message || "Error";
    }
}

SessionError.name = 'SessionError';
exports.SessionError = SessionError;