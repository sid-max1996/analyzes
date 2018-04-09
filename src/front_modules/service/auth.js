const ajax = require('../ajax.js');
const crypto = require('../crypto.js');

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

exports.entryCabinet = function(accessInfo) {
    console.log(accessInfo);
    document.cookie = "sessionId=" + accessInfo.sessionId;
    sessionStorage.setItem('sessionId', accessInfo.sessionId.toString());
    sessionStorage.setItem('accessString', accessInfo.accessString.toString());
    sessionStorage.setItem('secret', accessInfo.secret.toString());
    window.location.replace(ajax.SERVER_ADDRESS + 'cabinet');
    console.log(`success end`);
}