const log = require(appRoot + '/modules/log')(module);

module.exports.getStartPage = function(req, res) {
    // response.render("home.hbs", {
    //     title: "Страница Авторизации",
    //     //body: new hbs.SafeString("<h1>Hello World{{contact}}</h1>"),
    //     contact: 'Контакт'
    // });
    res.render("login.hbs", {
        title: "Вход в систему"
    });
}

module.exports.getSession = function(req, res, next) {
    const session = require(appRoot + '/modules/session');
    let authData = {
        id: 3,
        login: 'user3',
        secret: 'secret3'
    };
    session.saveAuthInfo(authData, (err, auth) => {
        if (err) {
            log.error(err);
            return next(err);
        }
        log.debug(auth.toString());
        res.json({
            "authId": auth._id,
            "secret": auth.secret
        });
    });
}

module.exports.auth = (req, res, next) => {
    res.render("auth.hbs", {
        title: "Auth Test"
    });
}

module.exports.mongo = (req, res) => {
    const mongoose = require(appRoot + '/modules/mongo');
    require(appRoot + '/modules/schema');
    let Cat = mongoose.model('Cat');
    var fluffy = new Cat({ name: 'fluffy' });
    Cat.remove({}, function(err, result) {
        if (err) return console.error(err);
        console.log(result);
        fluffy.save(function(err, fluffy) {
            if (err) return console.error(err);
            fluffy.speak();
            Cat.find(function(err, kittens) {
                if (err) return console.error(err);
                console.log(kittens);
                res.end('good');
            })
        });
    });
}