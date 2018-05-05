const ajax = require('./src/ajax.js');
const crypto = require('./src/crypto.js');

exports.getAuthInfo = function(login, password) {
    return new Promise(function(resolve, reject) {
        let jsonObjSend = {
            login: login
        };
        let jsonSend = JSON.stringify(jsonObjSend);
        ajax.json("api/auth", jsonSend)
            .then((json) => {
                console.log(`auth json: ${json}`);
                let jsonObj = JSON.parse(json);
                console.log(`authId = ${jsonObj.authId} password = ${password} secret = ${jsonObj.secret}`);
                resolve({
                    authId: jsonObj.authId,
                    password: password,
                    secret: jsonObj.secret
                });
            })
            .catch(error => console.error(error));
    });
}

exports.getSessionInfo = function({ authId, password, secret }) {
    return new Promise(function(resolve, reject) {
        let hashPass = crypto.encrypt(password, secret);
        let jsonObjSend = {
            authId: authId,
            hashPass: hashPass
        };
        let jsonSend = JSON.stringify(jsonObjSend);
        ajax.json("api/session", jsonSend)
            .then((json) => {
                console.log(`session json: ${json}`);
                let jsonObj = JSON.parse(json);
                console.log(`success end`);
                resolve(jsonObj);
            })
            .catch(error => console.error(error));
    });
}

exports.getAccess = function({ sessionId, accessString, secret }) {
    return new Promise(function(resolve, reject) {
        let hashAccess = crypto.makeHash(accessString, secret);
        console.log(`hashAccess = ${hashAccess}`);
        let jsonObjSend = {
            sessionId: sessionId,
            hashAccess: hashAccess
        };
        let jsonSend = JSON.stringify(jsonObjSend);
        ajax.json("api/access", jsonSend)
            .then((json) => {
                console.log(`account json: ${json}`);
                let jsonObj = JSON.parse(json);
                jsonObj.sessionId = sessionId;
                jsonObj.accessString = accessString;
                resolve(jsonObj);
            })
            .catch(error => console.error(error));
    });
}

exports.doLogin = function(sessionId) {
    return new Promise(function(resolve, reject) {
        let jsonObjSend = {
            sessionId: sessionId
        };
        let jsonSend = JSON.stringify(jsonObjSend);
        ajax.json("api/login", jsonSend)
            .then((json) => {
                console.log(`login json: ${json}`);
                let jsonObj = JSON.parse(json);
                resolve(jsonObj);
            })
            .catch(error => console.error(error));
    });
}

exports.entryCabinet = function(accessInfo) {
    exports.doLogin(accessInfo.sessionId)
        .then(() => {
            console.log(accessInfo);
            document.cookie = "sessionId=" + accessInfo.sessionId;
            localStorage.setItem('sessionId', accessInfo.sessionId.toString());
            localStorage.setItem('accessString', accessInfo.accessString.toString());
            localStorage.setItem('secret', accessInfo.secret.toString());
            window.location.replace(ajax.SERVER_ADDRESS + 'cabinet');
            console.log(`success end`);
        })
        .catch((err) => concole.log(err));
}

const getAccessData = function() {
    return {
        sessionId: localStorage.getItem('sessionId'),
        accessString: localStorage.getItem('accessString'),
        secret: localStorage.getItem('secret')
    };
}

exports.nextAccess = function() {
    return new Promise(function(resolve, reject) {
        let accessData = getAccessData();
        exports.getAccess(accessData)
            .then((data) => {
                return new Promise((resolve, reject) => {
                    if (data.sessionId && data.secret)
                        resolve(data);
                    else reject(new Error('there is no new secret for save'));
                });
            })
            .then((data) => {
                localStorage.setItem('secret', data.secret.toString());
                resolve(data.sessionId);
            })
            .catch(error => reject(error));
    });
}

exports.doLogout = function(sessionId) {
    let jsonObjSend = {
        sessionId: sessionId
    };
    let jsonSend = JSON.stringify(jsonObjSend);
    ajax.json("api/logout", jsonSend)
        .then((json) => {
            console.log(`logout json: ${json}`);
            window.location.replace(ajax.SERVER_ADDRESS);
        })
        .catch(error => console.error(error));
}