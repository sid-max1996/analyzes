exports.SERVER_ADDRESS = require('./config').serverAddr;

exports.post = (url, requestuestBody) => {
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.open("POST", exports.SERVER_ADDRESS + url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.addEventListener("load", function() {
            if (request.status < 400)
                resolve(request.responseText);
            else
                reject(new Error("Request rejected: " + request.statusText));
        });
        request.addEventListener("error", function() {
            reject(new Error("Network error"));
        });
        request.send(requestuestBody);
    });
}

exports.json = (url, json) => {
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.open("POST", exports.SERVER_ADDRESS + url, true);
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request.addEventListener("load", function() {
            if (request.status < 400)
                resolve(request.responseText);
            else
                reject(new Error("Request rejected: " + request.statusText));
        });
        request.addEventListener("error", function() {
            reject(new Error("Network error"));
        });
        request.send(json);
    });
}

exports.apiMethod = function(apiPath, jsonObjSend, callback) {
    let jsonSend = JSON.stringify(jsonObjSend);
    exports.json(apiPath, jsonSend)
        .then((jsonRes) => {
            console.log('jsonRes = ' + jsonRes);
            callback(null, jsonRes.toString());
        })
        .catch(error => console.error(error.message));
}