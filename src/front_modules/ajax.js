module.exports.SERVER_ADDRESS = 'http://localhost:3000/';

module.exports.post = (url, requestuestBody) => {
    return new Promise(function(succeed, fail) {
        var request = new XMLHttpRequest();
        request.open("POST", exports.SERVER_ADDRESS + url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.addEventListener("load", function() {
            if (request.status < 400)
                succeed(request.responseText);
            else
                fail(new Error("Request failed: " + request.statusText));
        });
        request.addEventListener("error", function() {
            fail(new Error("Network error"));
        });
        request.send(requestuestBody);
    });
}

module.exports.json = (url, json) => {
    return new Promise(function(succeed, fail) {
        var request = new XMLHttpRequest();
        request.open("POST", exports.SERVER_ADDRESS + url, true);
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request.addEventListener("load", function() {
            if (request.status < 400)
                succeed(request.responseText);
            else
                fail(new Error("Request failed: " + request.statusText));
        });
        request.addEventListener("error", function() {
            fail(new Error("Network error"));
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