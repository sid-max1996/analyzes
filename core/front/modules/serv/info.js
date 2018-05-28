const lib = require('../lib');
const ajax = lib.ajax;
const local = lib.local;

exports.setSession = function(name, value) {
    return ajax.req('PUT', 'session/set', ['sessionId', 'name', 'value'], [local.sessId(), name, value]);
}

exports.getSession = function(name) {
    return ajax.req('POST', 'session/get', ['sessionId', 'name'], [local.sessId(), name]);
}

exports.getRoleId = function() {
    return ajax.req("POST", 'info/roleId', ['sessionId'], [local.sessId()], (data) => Promise.resolve(data.roleId));
}

exports.getRoleInfo = function() {
    return ajax.req('POST', 'info/roleInfo', ['sessionId'], [local.sessId()]);
}

exports.getOptionsInfo = function(name) {
    return ajax.req('POST', `info/options`, ['name'], [name], (data) => {
        let options = [];
        data.forEach(item =>
            options.push({ title: item.name, value: item.id }));
        return Promise.resolve(options);
    });
}