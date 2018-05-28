const http = require('http');

exports.mess = function(name, params) {
    switch (name) {
        case 'needParams':
            return params + ' - требуемые параметры';
        case 'exist':
            return params + ' не существует(ют)';
        default:
            return params;
    }
}

exports.code = function(name) {
    switch (name) {
        case 'badReq':
            return 400;
        case 'found':
            return 404;
        case 'accept':
            return 406;
        default:
            return 400;
    }
}

class HttpError extends Error {
    constructor(status, message) {
        super(arguments);
        this.status = status;
        this.message = message || http.STATUS_CODES[status] || "Error";
    }
}
HttpError.name = 'HttpError';
exports.HttpError = HttpError;

class ShowError extends HttpError {
    constructor(code, message) {
        super(code, message);
    }
}
ShowError.name = 'ShowError';
exports.ShowError = ShowError;

class HideError extends HttpError {
    constructor(message) {
        super(500, message);
    }
}
HideError.name = 'HideError';
exports.HideError = HideError;

class JsonError extends Error {
    constructor(error) {
        super(arguments);
        this.instance = error;
    }
}
JsonError.name = 'JsonError';
exports.JsonError = JsonError;