const SERVER_ADDRESS = 'http://localhost:3000/';
module.exports.SERVER_ADDRESS = SERVER_ADDRESS;

module.exports.post = (url, requestuestBody) => {
    return new Promise(function(succeed, fail) {
      var request = new XMLHttpRequest();
      request.open("POST", url, true);
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


