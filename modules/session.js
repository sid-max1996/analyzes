const mongoose = require('./mongo/');
const Auth = require('./mongo/models/auth').Auth;
const User = require('./mongo/models/user').User;

const getSecretKey = require('./protect').getSecretKey;
const log = require('./log')(module);

exports.saveAuthInfo = (authData, callback) => {
    log.debug('saveAuthInfo');
    Auth.create(authData, callback);
}

exports.getAuthById = (authId, callback) => {
    Auth.findById(authId, function(err, auth) {
        if (err) {
            log.error(err.message);
            callback(err);
        } else {
            callback(null, auth);
        }
    });
}

exports.authorize = (userData, callback) => {
    const AuthError = require('./error').AuthError;
    log.debug('authorize');
    User.create(userData, callback);
}

exports.updateUser = (userData, callback) => {
    User.findByIdAndUpdate(userData._id, userData, callback);
}

exports.getUserById = (userId, callback) => {
    log.debug(`userId = ${userId}`);
    User.findById(userId, function(err, user) {
        if (err) {
            log.error(err.message);
            callback(err);
        } else {
            callback(null, user);
        }
    });
}