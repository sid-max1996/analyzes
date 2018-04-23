const ajax = require('../ajax.js');

function getSessionId() {
    return sessionStorage.getItem('sessionId');
}

exports.getUserData = function() {
    return new Promise((resolve, reject) => {
        let jsonObjSend = {
            sessionId: getSessionId()
        };
        let jsonSend = JSON.stringify(jsonObjSend);
        ajax.json("api/get/userData", jsonSend)
            .then((json) => {
                console.log(`getUserData json: ${json}`);
                let jsonObj = JSON.parse(json);
                resolve(jsonObj);
            })
            .catch(error => reject(error));
    });
}

exports.saveAnketa = function({ firstName, secondName, phone, city, workPlace, aboutYourself }) {
    return new Promise((resolve, reject) => {
        let jsonObjSend = {
            sessionId: getSessionId(),
            firstName: firstName,
            secondName: secondName,
            phone: phone,
            city: city,
            workPlace: workPlace,
            aboutYourself: aboutYourself
        };
        let jsonSend = JSON.stringify(jsonObjSend);
        ajax.json("api/save/userAnketa", jsonSend)
            .then((json) => {
                console.log(`saveAnketa json: ${json}`);
                let jsonObj = JSON.parse(json);
                resolve(jsonObj);
            })
            .catch(error => reject(error));
    });
}

exports.getAnketaData = function() {
    return new Promise((resolve, reject) => {
        let jsonObjSend = {
            sessionId: getSessionId()
        };
        let jsonSend = JSON.stringify(jsonObjSend);
        ajax.json("api/get/userAnketa", jsonSend)
            .then((json) => {
                console.log(`getUserAnketa json: ${json}`);
                let jsonObj = JSON.parse(json);
                resolve(jsonObj);
            })
            .catch(error => reject(error));
    });
}

exports.getSettingsData = function() {
    return new Promise((resolve, reject) => {
        let jsonObjSend = {
            sessionId: getSessionId()
        };
        let jsonSend = JSON.stringify(jsonObjSend);
        ajax.json("api/get/userSettings", jsonSend)
            .then((json) => {
                console.log(`getUserSettings json: ${json}`);
                let jsonObj = JSON.parse(json);
                resolve(jsonObj);
            })
            .catch(error => reject(error));
    });
}

exports.saveSettings = function({ email, password }) {
    return new Promise((resolve, reject) => {
        let jsonObjSend = {
            sessionId: getSessionId(),
            email: email
        };
        console.log('p ' + password);
        if (password) {
            jsonObjSend.password = password;
        }
        let jsonSend = JSON.stringify(jsonObjSend);
        ajax.json("api/save/userSettings", jsonSend)
            .then((json) => {
                console.log(`saveSettings json: ${json}`);
                let jsonObj = JSON.parse(json);
                resolve(jsonObj);
            })
            .catch(error => reject(error));
    });
}