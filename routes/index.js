const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();

module.exports = function(app) {
    //SITE PART
    app.get("/", require('./site').getStartPage);
    app.get("/cabinet", require('./site').getCabinet);

    //SESSION PART
    const session = require('express').Router();
    app.use("/session", session);
    session.post("/setValue", jsonParser, require('./common/session').setValue);
    session.post("/getValue", jsonParser, require('./common/session').getValue);

    //API PART
    const api = require('express').Router();
    app.use("/api", api);
    //auth part
    api.post("/auth", jsonParser, require('./api/auth').getAuth);
    api.post("/session", jsonParser, require('./api/auth').getSession);
    api.post("/access", jsonParser, require('./api/auth').getAccess);
    api.post("/login", jsonParser, require('./api/auth').doLogin);
    api.post("/logout", jsonParser, require('./api/auth').doLogout);
    //user part
    api.post("/get/userData", jsonParser, require('./api/user').getUserData);
    api.post("/get/userAnketa", jsonParser, require('./api/user').getUserAnketa);
    api.post("/save/userAnketa", jsonParser, require('./api/user').saveUserAnketa);
    api.post("/get/userSettings", jsonParser, require('./api/user').getUserSettings);
    api.post("/save/userSettings", jsonParser, require('./api/user').saveUserSettings);
    //admin part
    api.post("/add/user", jsonParser, require('./api/admin').addUser);

};