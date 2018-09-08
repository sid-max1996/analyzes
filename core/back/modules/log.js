const winston = require('winston');
const config = require('./config');
const ENV = process.env.NODE_ENV;

// can be much more flexible than that O_o
function getConsoleLogger(module) {

    let path = module.filename.split('/').slice(-2).join('/');

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: (ENV == 'development') ? 'debug' : 'debug',
                label: path
            }),
            new winston.transports.File({
                filename: config.get('logPath'),
                level: (ENV == 'development') ? 'debug' : 'error',
                label: path
            })
        ]
    });
}

module.exports = getConsoleLogger;