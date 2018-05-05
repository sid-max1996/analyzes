const http = require("http");
const path = require("path");
const express = require("express");
const hbs = require("express-hbs");
const log = require('./modules/log')(module);
const config = require('./config');
const cookieParser = require('cookie-parser');
const HttpError = require('./modules/error').HttpError;
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const app = express();

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