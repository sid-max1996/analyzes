const Auth = require('./instance/models/auth');
const User = require('./instance/models/user');
const getSecretKey = require('../protect/crypto').getSecretKey;
const log = require('../log')(module);
const check = require('../../../lib').valid.check;
const error = require('../error');
const ShowError = error.ShowError;
const HideError = error.HideError;

exports.saveAuthInfo = (auth) => {
    return new Promise((resolve, reject) => {
        log.debug('saveAuthInfo');
        Auth.create(auth)
            .then((auth) => {
                if (check.isNull(auth)) reject(new HideError('saveAuthInfo fun error'));
                else resolve(auth);
            })
            .catch((err) => reject(err));
    });
}

exports.getAuthById = (authId, callback) => {
    return new Promise((resolve, reject) => {
        Auth.findById(authId)
            .then((auth) => {
                if (check.isNull(auth)) reject(new HideError('getAuthById fun error'));
                else resolve(auth);
            })
            .catch((err) => reject(err));
    });
}

exports.createUser = (user) => {
    return new Promise((resolve, reject) => {
        log.debug('authorize createUser');
        User.create(user)
            .then((user) => {
                if (check.isNull(user)) reject(new HideError('createUser fun error'));
                else resolve(user);
            })
            .catch((err) => reject(err));
    });
}

exports.updateUser = (user) => {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(user._id, user)
            .then((user) => {
                User.findById(user._id)
                    .then((user) => {
                        if (check.isNull(user)) reject(new HideError('updateUser fun error'));
                        else resolve(user);
                    })
                    .catch(err => reject(err));
            })
            .catch((err) => reject(err));
    });
}

exports.getUserById = (sessionId) => {
    return new Promise((resolve, reject) => {
        log.debug(`sessionId = ${sessionId}`);
        log.debug(User);
        User.findById(sessionId)
            .then((user) => {
                if (check.isNull(user)) reject(new HideError('getUserById fun error'));
                else resolve(user);
            })
            .catch((err) => reject(err));
    });
}

exports.getUserId = function(sessionId) {
    log.debug(`getUserId: sessionId = ${sessionId}`);
    return new Promise((resolve, reject) => {
        exports.getUserById(sessionId)
            .then((user) => {
                if (check.isNull(user)) reject(new HideError('getUserId fun error'));
                resolve(user.id);
            })
            .catch((err) => reject(err));
    });
}