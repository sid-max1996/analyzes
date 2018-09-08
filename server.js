"use strict";
const http = require("http");
const path = require("path");
const express = require("express");
const hbs = require("express-hbs");
const config = require('./config');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const log = require('./core/back/modules/log')(module);
const JsonError = require('./core/back/modules/error').JsonError;
const ShowError = require('./core/back/modules/error').ShowError;

const app = express();

console.log('server run');

//hbs helpers
hbs.registerHelper("getServerAddr", () => {
    return `${config.get('serverAddr')}:${config.get('port')}`;
});

//настройки
global.appRoot = path.resolve(__dirname);
app.set("view engine", "hbs");
app.set('views', __dirname + '/views');
app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/partials'
}));

//журналирование
switch (app.get('env')) {
    case 'development':
        app.use(require('morgan')('dev'));
        break;
    case 'production':
        app.use(require('express-logger')({
            path: __dirname + '/log/requests.log'
        }));
        break;
}

//middleware
app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/checkCluster'));
app.use(require('cors')());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '5mb' }));

//подключение обработчиков запросов
require('./routes')(app);
app.use(express.static(path.join(__dirname, 'public')));

//обработка ошибок
app.use(function(err, req, res, next) {
    let isJson = false;
    if (err instanceof JsonError) {
        isJson = true;
        err = err.instance;
    }
    log.error(err);
    if (err instanceof ShowError) {
        log.error('show error: ' + err.message);
        if (isJson) res.json({ success: false, error: err.message });
        else res.sendHttpError(err);
    } else {
        log.error('server error: ' + err.message);
        if (isJson) res.json({ success: false, error: 'Ошибка на сервере' });
        else {
            if (app.get('env') == 'development')
                express.errorHandler()(err, req, res, next);
            else res.sendHttpError(new HttpError(500, 'Ошибка на сервере'));
        }
    }
});

//запуск сервера
function startServer() {
    const domain = require('domain').create();

    domain.run(() => {
        const server = http.createServer(app);
        server.listen(config.get('port'), function() {
            log.info(`Express server listening on port ${config.get('port')} in ${app.get('env')} mode`);
        });
    });

    domain.on('error', (err) => {
        log.error(`ОШИБКА ДОМЕНА!!! \n ${err.stack}`);
        log.error(' Отказобезопасный останов.');
        process.exit(1);
    });

}

if (require.main === module) {
    startServer();
} else {
    module.exports = startServer;
}