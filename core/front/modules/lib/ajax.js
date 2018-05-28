const object = require('../../../lib').meta.object;

exports.SERVER_ADDRESS = require('../config').serverAddr;

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

exports.json = (met, url, json) => {
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open(met, exports.SERVER_ADDRESS + url, true);
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

exports.apiMethod = function(met, apiPath, jsonObjSend) {
    return new Promise(function(resolve, reject) {
        let jsonSend = JSON.stringify(jsonObjSend);
        exports.json(met, apiPath, jsonSend)
            .then((jsonRes) => {
                console.log('apiMethod jsonRes = ' + jsonRes.substr(0, 1000));
                let jsonObjRes = JSON.parse(jsonRes);
                resolve(jsonObjRes);
            })
            .catch(err => reject(err));
    });
}

exports.req = function(met, path, props, values, thenFun = (data) => Promise.resolve(data)) {
    let jsonObjSend = object.create(props, values);
    return exports.apiMethod(met, path, jsonObjSend)
        .then(thenFun)
        .catch(err => Promise.reject(err));
}

exports.api = function(met, path, props, values, thenFun = (data) => Promise.resolve(data)) {
    return exports.req(met, 'api/' + path, props, values, thenFun);
}