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