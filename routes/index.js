"use strict";
module.exports = function(app) {
    //SITE PART
    app.get("/", require('./site').getStartPage);
    app.get("/cabinet*", require('./site').getCabinet);
    app.get("/analyzes*", require('./site').getAnalyzes);
    app.get("/statistics*", require('./site').getStatistics);

    //SESSION PART
    const session = require('express').Router();
    app.use("/session", session);
    session.post("/get", require('./api/session').getValue);
    session.put("/set", require('./api/session').setValue);

    //AUTH PART
    const auth = require('express').Router();
    app.use("/auth", auth);
    auth.put("/create", require('./api/auth').setAuth);
    auth.put("/session", require('./api/auth').setSession);
    auth.put("/access", require('./api/auth').setAccess);
    auth.post("/login", require('./api/auth').doLogin);
    auth.post("/logout", require('./api/auth').doLogout);

    //INFO PART
    const info = require('express').Router();
    app.use("/info", info);
    info.post("/roleId", require('./api/info').getRoleId);
    info.post("/roleInfo", require('./api/info').getRoleInfo);

    //API PART
    const api = require('express').Router();
    app.use("/api", api);
    // api.post("info", require('./api/info').getInfo);
    // api.post("data", require('./api/data').getData);
    // api.put("data", require('./api/data').saveData);
    // api.delete("data", require('./api/data').removeData);

    //CABINET PART
    api.post("/cabinet", require('./api/cabinet').getCabinet);
    api.post("/anketa", require('./api/cabinet').getAnketa);
    api.put("/anketa", require('./api/cabinet').saveAnketa);
    api.post("/settings", require('./api/cabinet').getSettings);
    api.put("/settings", require('./api/cabinet').saveSettings);
    //admin cabinet
    api.post("/users", require('./api/cabinet/admin').getUsers);
    api.put("/add/user", require('./api/cabinet/admin').addUser);
    api.put("/update/user", require('./api/cabinet/admin').updateUser);
    api.delete("/users", require('./api/cabinet/admin').removeUsers);

    //ANALYZES PART 
    api.post("/groups", require('./api/analyzes').getGroups);
    api.post("/group/add/params", require('./api/analyzes').getAddGroupParams);
    api.put("/add/group", require('./api/analyzes').addGroup);
    api.post("/analyzes", require('./api/analyzes').getRecords);
    api.post("/group/info", require('./api/analyzes').getGroupCols);
    api.put("/update/analyze", require('./api/analyzes').updateRecord);
    api.delete("/analyzes", require('./api/analyzes').removeRecords);
    api.put("/save/analyzes", require('./api/analyzes').addRecords);
    api.post("/group/settings", require('./api/analyzes').getGroupSettings);
    api.delete("/group", require('./api/analyzes').removeGroup);
    api.put("/group/name", require('./api/analyzes').changeGroupName);
    api.delete("/group/member", require('./api/analyzes').removeGroupMember);
    api.put("/group/member", require('./api/analyzes').addGroupMember);
    api.delete("/group/analyze", require('./api/analyzes').removeGroupAnalyze);
    api.put("/group/analyze", require('./api/analyzes').addGroupAnalyze);
    api.delete("/group/anketa", require('./api/analyzes').removeGroupAnketa);
    api.put("/group/anketa", require('./api/analyzes').addGroupAnketa);
    api.post("/cols/data", require('./api/analyzes').getColsData);
    api.post("/col/info", require('./api/analyzes').getColInfo);
    api.put("/col/op", require('./api/analyzes').addColOption);
    api.delete("/col/op", require('./api/analyzes').removeColOption);
    api.put("/col", require('./api/analyzes').addColumn);
    api.delete("/col", require('./api/analyzes').removeColumn);
    api.put("/op", require('./api/analyzes').addOption);
    api.delete("/op", require('./api/analyzes').removeOption);
    //STATISTICS PART
    api.post("/selections", require('./api/statistics').getSelections);
    api.post("/selection/add/info", require('./api/statistics').getAddSelection);
    api.put("/selection", require('./api/statistics').addSelection);
    api.post("/selection/records/info", require('./api/statistics').getSelGroupCols);
    api.post("/selection/items", require('./api/statistics').getSelItems);
    api.put("/selection/items", require('./api/statistics').pushSelItems);
    api.post("/selection/info", require('./api/statistics').getSelInfo);
    api.delete("/selection/items", require('./api/statistics').removeSelItems);
    api.delete("/selection", require('./api/statistics').removeSel);
    api.post("/statistics/info", require('./api/statistics').getStatisticsInfo);
    api.post("/statistics/calc/cols", require('./api/statistics').getStatCalcCols);
    api.post("/statistics/calc/filters", require('./api/statistics').getStatCalcFilters);
    api.post("/statistics/calc/alleles", require('./api/statistics').getStatCalcAlleles);
    api.post("/statistics/calc/xisquere", require('./api/statistics').getStatCalcXiSquere);
};