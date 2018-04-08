const http = require("http");
const path = require("path");
const express = require("express");
const hbs = require("express-hbs");

// var firebird = require('node-firebird');
// var events = require('events');
// var util = require('util');
// var fs = require('fs');

const log = require('./modules/log')(module);
const config = require('./config');
const HttpError = require('./modules/error').HttpError;

const app = express();

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

//подключение обработчиков запросов
require('./routes')(app);
app.get('/fail', function(req, res) {
    throw new HttpError(404);
    process.nextTick(function() {
        throw new Error('Бабах!');
    });
});
app.use(express.static(path.join(__dirname, 'public')));

//обработка ошибок
app.use(function(err, req, res, next) {
    if (typeof err == 'number') {
        err = new HttpError(err);
    }

    if (err instanceof HttpError) {
        log.error(err);
        res.sendHttpError(err);
    } else {
        if (app.get('env') == 'development') {
            log.error('server error: ' + err.message);
            express.errorHandler()(err, req, res, next);
        } else {
            log.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
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