const back = require('../../core/back');
const session = back.session;
const log = back.log(module);
const access = back.protect.access;
const lib = require('../../core/lib');
const array = lib.meta.array;
const object = lib.meta.object;

exports.getStartPage = function(req, res) {
    res.render("login.hbs", {
        title: "Вход в систему"
    });
}

exports.getCabinet = async function(req, res, next) {
    let sessionId = req.cookies.sessionId;
    access.check(sessionId, false, false)
        .then(session.getUserById)
        .then((user) => res.render("cabinet.hbs", object.create(
            ['title', 'isDarkScheme'], ["Личный кабинет", user.colorScheme === "dark"]
        )))
        .catch((err) => next(err));
}

exports.getAnalyzes = async function(req, res, next) {
    let sessionId = req.cookies.sessionId;
    access.check(sessionId, false, false)
        .then(session.getUserById)
        .then((user) => res.render("main.hbs", object.create(
            array.clone(['compName', 'title', 'isDarkScheme']),
            array.clone(['analyzes', "Результаты анализов", user.colorScheme === "dark"])
        )))
        .catch((err) => next(err));
}

exports.getStatistics = async function(req, res, next) {
    let sessionId = req.cookies.sessionId;
    access.check(sessionId, false, false)
        .then(session.getUserById)
        .then((user) => res.render("main.hbs", object.create(
            array.clone(['compName', 'title', 'isDarkScheme']),
            array.clone(['statistics', "Статистика", user.colorScheme === "dark"])
        )))
        .catch((err) => next(err));
}