const ajax = require('../ajax');
const helper = require('../helper');

exports.setValue = function(name, value) {
    let jsonObjSend = {
        sessionId: helper.getSessionId(),
        name: name,
        value: value
    };
    let jsonSend = JSON.stringify(jsonObjSend);
    ajax.json("session/setValue", jsonSend)
        .then((json) => {
            console.log(`setValue json: ${json}`);
        })
        .catch(error => console.error(error));
}

exports.getValue = function(name) {
    return new Promise((resolve, reject) => {
        let jsonObjSend = {
            sessionId: helper.getSessionId(),
            name: name
        };
        let jsonSend = JSON.stringify(jsonObjSend);
        ajax.json("session/getValue", jsonSend)
            .then((json) => {
                console.log(`getValue json: ${json}`);
                let jsonObj = JSON.parse(json);
                resolve(jsonObj);
            })
            .catch(error => reject(error));
    });
}