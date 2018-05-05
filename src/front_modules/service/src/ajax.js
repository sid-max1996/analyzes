const object = require('../../meta/object');

exports.SERVER_ADDRESS = require('../../config').serverAddr;

exports.post = (url, reqBody) => {
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open("POST", exports.SERVER_ADDRESS + url, true);
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.addEventListener("load", function() {
            if (req.status < 400)
                resolve(req.responseText);
            else reject(new Error("request rejected: " + req.statusText));
        });
        req.addEventListener("error", function() {
            reject(new Error("Network error"));
        });
        req.send(reqBody);
    });
}

exports.json = (url, json) => {
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open("POST", exports.SERVER_ADDRESS + url, true);
        req.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        req.addEventListener("load", function() {
            if (req.status < 400)
                resolve(req.responseText);
            else reject(new Error("request rejected: " + req.statusText));
        });
        req.addEventListener("error", function() {
            reject(new Error("Network error"));
        });
        req.send(json);
    });
}

exports.apiMethod = function(apiPath, jsonObjSend) {
    return new Promise(function(resolve, reject) {
        let jsonSend = JSON.stringify(jsonObjSend);
        exports.json(apiPath, jsonSend)
            .then((jsonRes) => {
                console.log('apiMethod jsonRes = ' + jsonRes);
                let jsonObjRes = JSON.parse(jsonRes);
                resolve(jsonObjRes);
            })
            .catch(err => reject(err));
    });
}

exports.req = function(path, props, values, thenFun = (data) => Promise.resolve(data)) {
    let jsonObjSend = object.create(props, values);
    return exports.apiMethod(path, jsonObjSend)
        .then(thenFun)
        .catch(err => Promise.reject(err));
}

exports.api = function(path, props, values, thenFun = (data) => Promise.resolve(data)) {
    return exports.req('api/' + path, props, values, thenFun);
}