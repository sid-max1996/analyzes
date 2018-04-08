const mongoose = require('../index.js');
const appRoot = require('../../../config').get('rootDir');
const authConfig = require('../../../config').get('authConfig');
const Schema = mongoose.Schema;

const log = require(appRoot + '/modules/log')(module);

const waterfall = require('async').waterfall;


var schema = new Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    login: {
        type: String,
        unique: true,
        required: true
    },
    secret: {
        type: String,
        required: true
    },
    tryCount: {
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

schema.statics.create = function(authData, callback) {
    let Auth = this;
    Auth.findOne({ id: authData.id }, function(err, auth) {
        log.debug(`findOne auth = ${auth}, err = ${err}`);
        if (err) {
            log.debug(`err = ${err}`);
            callback(err);
        }
        if (auth) {
            Auth.findByIdAndUpdate(auth._id, authData, function(err, auth) {
                if (err) {
                    log.debug(`err = ${err}`);
                    callback(err);
                } else {
                    Auth.findById(auth._id, function(err, auth) {
                        if (err) {
                            log.debug(`err = ${err}`);
                            callback(err);
                        } else {
                            callback(null, auth);
                        }
                    });
                }
            });
        } else {
            let auth = new Auth(authData);
            auth.save(callback);
        }
    });
};

schema.methods.authorize = function(hashPassword, callback) {
    const AuthError = require(appRoot + '/modules/error').AuthError;
    let auth = this;
    waterfall([
        function(callback) {
            log.debug('tryCount = ' + auth.tryCount);
            if (auth.tryCount >= authConfig.maxAuthCount) {
                if (auth.tryCount === authConfig.maxAuthCount) {
                    auth.created = Date.now();
                    auth.tryCount = auth.tryCount + 1;
                }
                let created = new Date();
                let limit = new Date(auth.created);
                limit.setHours(limit.getHours() + authConfig.hoursLimit);
                log.debug(`limit = ${limit} created = ${created}`);
                if (created < limit)
                    callback(new AuthError("Превышено максимальное количество попыток"));
                else {
                    auth.tryCount = 0;
                    callback(null);
                }
            } else
                callback(null);
        },
        function(callback) {
            log.debug(`checkPassword`);
            const decrypt = require(appRoot + '/modules/protect').decrypt;
            const getSecretKey = require(appRoot + '/modules/protect').getSecretKey;
            log.debug('secret = ' + auth.secret);
            let password = decrypt(hashPassword, auth.secret);
            password = 'dsa';
            if (password) {
                auth.tryCount = 0;
                callback(null);
            } else {
                auth.tryCount = auth.tryCount + 1;
                callback(new AuthError("Пароль неверен"));
            }
        }
    ], callback);
};

module.exports.Auth = mongoose.model('Auth', schema);