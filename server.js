const http = require("http");
const path = require("path");
const express = require("express");
const hbs = require("express-hbs");
const bodyParser = require("body-parser");
// var firebird = require('node-firebird');
// var events = require('events');
// var util = require('util');
// var fs = require('fs');

const protect = require("./modules/protect.js");
const user = require("./modules/user.js");
const bd = require("./modules/bd.js");

const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

app.set("view engine", "hbs");
app.set('views', __dirname + '/views');
app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/partials'
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res) { 
    // response.render("home.hbs", {
    //     title: "Страница Авторизации",
    //     //body: new hbs.SafeString("<h1>Hello World{{contact}}</h1>"),
    //     contact: 'Контакт'
    // });
    res.render("login.hbs", {
        title: "Вход в систему"
    });
});

let checkHash = null;
app.post("/api/secretkey", urlencodedParser, function(req, res) { 
   let login = req.body.login;
   if (!login) {
        res.statusCode = 500; 
        res.end("login was not sent");
   }
   res.setHeader("Content-Type", "application/json");
   if (user.existByLogin(login)) {
        let bdPassword = bd.getBdPasswordByLogin(login);
        let userId = user.makeLocalStoradgeUser(login, bdPassword);
        let [secretkey, hash] = protect.getSecretKey(userId + login);
        protect.setCryptoUserSecretKeyAndHash(secretkey, hash);
        checkHash = hash;
        res.send({
                secretkey: secretkey,
                userId: userId
            });
    }
    else {
        console.log('login not exist');
        res.statusCode = 500; 
        res.end("login not exist");
    }
});

app.post("/api/login", urlencodedParser, function(req, res) { 
    if (!req.body.userId && !req.body.password && !req.body.hash) {
         res.statusCode = 500; 
         res.end("login was not sent");
    }
    let userId = req.body.userId;
    if (user.existById(userId) && checkHash === req.body.hash) {
        let login = user.getLoginById(userId);  
        let secret = user.getSecretById(userId); 
        let password = protect.decrypt(req.body.password, secret); 
        if (protect.checkPasswordById(userId, password)) {
            //установка значений для user, дать разрешение на вход
            res.setHeader("Content-Type", "application/json");
            let [secretkey, hash] = protect.getSecretKey(userId + login + password);       
            checkHash = hash;
            res.send({secretkey: secretkey});
        }
        else {
            checkHash = null;
            res.statusCode = 500; 
            res.end("bad password");
        }    
    }
    else {
        console.log('id not exist');
        res.statusCode = 500; 
        res.end("id not exist");
    }
 });

app.post("/api/checkuser", urlencodedParser, function(req, res) { 
    if (!req.body.userId && !req.body.hash) {
        res.statusCode = 500; 
        res.end("login was not sent");
    }
    let userId = req.body.userId;
    let login = user.getLoginById(userId);  
    let password = user.getPasswordById(userId);
    console.log(checkHash);
    if (checkHash === req.body.hash) {
        console.log('good hash');
        res.setHeader("Content-Type", "application/json");
        let [secretkey, hash] = protect.getSecretKey(userId + login + password);
        checkHash = hash;
        res.send({secretkey: secretkey});
    }
    else {
        res.statusCode = 500; 
        res.end("bad hash");
    }
 });

const server = http.createServer(app);
server.listen(3000, function(){});
