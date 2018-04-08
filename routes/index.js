const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();

module.exports = function(app) {
    //SITE PART
    app.get("/", require('./site').getStartPage);
    app.get("/session", jsonParser, require('./site').getSession);
    app.get("/auth", require('./site').auth);
    app.get("/mongo", require('./site').mongo);

    //API PART
    const api = require('express').Router();
    app.use("/api", api);
    //auth part
    api.post("/auth", jsonParser, require('./api/auth').getAuth);
    api.post("/session", jsonParser, require('./api/auth').getSession);
    api.post("/access", jsonParser, require('./api/auth').getAccess);

    api.post("/add/user", jsonParser, require('./api/admin').addUser);

};