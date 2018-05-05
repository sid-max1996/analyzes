module.exports = function(app) {
    //SITE PART
    app.get("/", require('./site').getStartPage);
    app.get("/cabinet*", require('./site').getCabinet);

    //SESSION PART
    const session = require('express').Router();
    app.use("/session", session);
    session.post("/setValue", require(appRoot + '/modules/storadge').setValue);
    session.post("/getValue", require(appRoot + '/modules/storadge').getValue);

    //API PART
    const api = require('express').Router();
    app.use("/api", api);
    //auth part
    api.post("/auth", require('./api/auth').getAuth);
    api.post("/session", require('./api/auth').getSession);
    api.post("/access", require('./api/auth').getAccess);
    api.post("/login", require('./api/auth').doLogin);
    api.post("/logout", require('./api/auth').doLogout);
    //info part
    api.post("/role", require('./api/info').getRoleId);
    api.post("/roleInfo", require('./api/info').getRoleInfo);
    //cabinet part
    api.post("/get/userCabinet", require('./api/cabinet').getCabinetData);
    api.post("/get/userAnketa", require('./api/cabinet').getAnketaData);
    api.post("/save/userAnketa", require('./api/cabinet').saveAnketaData);
    api.post("/get/userSettings", require('./api/cabinet').getSettingsData);
    api.post("/save/userSettings", require('./api/cabinet').saveSettingsData);
    //admin part
    api.post("/users", require('./api/admin').getUsers);
    api.post("/add/user", require('./api/admin').addUser);
    api.post("/update/user", require('./api/admin').updateUser);
    api.post("/remove/users", require('./api/admin').removeUsers);
    //api.post("/add/user", require('./api/admin').addUser);

    //option
    api.post("/options/role", require('./api/info').getRoleOption)

};