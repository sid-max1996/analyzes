const mongoose = require('./mongo/');
const Auth = require('./mongo/models/auth').Auth;
const User = require('./mongo/models/user').User;

const getSecretKey = require('./protect').getSecretKey;
const log = require('./log')(module);
const SessionError = require('./error').SessionError;

exports.saveAuthInfo = (auth) => {
    return new Promise((resolve, reject) => {
        log.debug('saveAuthInfo');
        Auth.create(auth)
            .then((auth) => { resolve(auth) })
            .catch((err) => reject(new SessionError(err.message)));
    });
}

exports.getAuthById = (authId, callback) => {
    return new Promise((resolve, reject) => {
        Auth.findById(authId)
            .then((auth) => resolve(auth))
            .catch((err) => reject(new SessionError(err.message)));
    });
}

exports.doAuthorize = (user) => {
    return new Promise((resolve, reject) => {
        const AuthError = require('./error').AuthError;
        log.debug('authorize');
        User.create(user)
            .then((user) => resolve(user))
            .catch((err) => reject(new SessionError(err.message)));
    });
}

exports.updateUser = (user) => {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(user._id, user)
            .then((user) => {
                User.findById(user._id)
                    .then((user) => resolve(user))
                    .catch(err => reject(err));
            })
            .catch((err) => reject(new SessionError(err.message)));
    });
}

exports.getUserById = (userId) => {
    return new Promise((resolve, reject) => {
        log.debug(`userId = ${userId}`);
        User.findById(userId)
            .then((user) => resolve(user))
            .catch((err) => reject(new SessionError(err.message)));
    });
}