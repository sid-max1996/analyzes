const lib = require('../lib');
const ajax = lib.ajax;
const crypto = lib.crypto;
const local = lib.local;
const coreLib = require('../../../lib');
const object = coreLib.meta.object;
const fil = coreLib.modif.filters;
const transform = coreLib.modif.transform;


exports.getAuthInfo = function(login, password) {
    return ajax.req('PUT', 'auth/create', ['login'], [login], data => {
        object.setProps(data, ['password'], [password]);
        return Promise.resolve(data);
    });
}

exports.getSessionInfo = function({ authId, password, secret }) {
    let hashPass = crypto.encrypt(password, secret);
    return ajax.req('PUT', 'auth/session', ['authId', 'hashPass'], [authId, hashPass]);
}

exports.getAccess = function({ sessionId, accessString, secret }) {
    let hashAccess = crypto.makeHash(accessString, secret);
    return ajax.req('PUT', 'auth/access', ['sessionId', 'hashAccess'], [sessionId, hashAccess],
        data => {
            object.setProps(data, ['sessionId', 'accessString'], [sessionId, accessString]);
            return Promise.resolve(data);
        });
}

exports.doLogin = function(sessionId) {
    return ajax.req('POST', 'auth/login', ['sessionId'], [sessionId]);
}

exports.doLogout = function(sessionId) {
    return ajax.req('POST', 'auth/logout', ['sessionId'], [sessionId],
        data => window.location.replace(ajax.SERVER_ADDRESS));
}

exports.entryCabinet = function(accessInfo) {
    accessInfo = transform(accessInfo, [fil.string]);
    let { sessionId, accessString, secret } = accessInfo;
    exports.doLogin(sessionId)
        .then(() => {
            document.cookie = "sessionId=" + sessionId;
            local.setItems(['sessionId', 'accessString', 'secret'], [sessionId, accessString, secret]);
            window.location.replace(ajax.SERVER_ADDRESS + 'cabinet');
        })
        .catch((err) => concole.log(err));
}

const getAccessData = function() {
    return object.create(['sessionId', 'accessString', 'secret'], [
        local.sessId(), local.get('accessString'), local.get('secret')
    ]);
}

exports.nextAccess = function() {
    return new Promise(function(resolve, reject) {
        let accessData = getAccessData();
        exports.getAccess(accessData)
            .then((data) => {
                return new Promise((resolve, reject) => {
                    if (data.sessionId && data.secret) resolve(data);
                    else reject(new Error('there is no new secret for save'));
                });
            })
            .then((data) => {
                local.set('secret', data.secret);
                resolve(data.sessionId);
            })
            .catch(error => reject(error));
    });
}