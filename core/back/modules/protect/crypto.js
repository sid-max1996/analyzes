const crypto = require("crypto");
const log = require('../log')(module);

exports.makeHash = (value, secret, algorithm = 'sha256') => {
    let hmac = crypto.createHmac(algorithm, secret);
    hmac.update(value);
    let hash = hmac.digest('hex');
    return hash;
}

exports.encrypt = (text, secret, algorithm = 'aes-256-ctr') => {
    let cipher = crypto.createCipher(algorithm, secret);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

exports.decrypt = (text, secret, algorithm = 'aes-256-ctr') => {
    let decipher = crypto.createDecipher(algorithm, secret);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

exports.getHashPassAndSalt = function(password) {
    return new Promise((resolve, reject) => {
        if (!password) reject(new Error('getHashPassAndSalt no param'));
        var bcrypt = require('bcrypt');
        const saltRounds = 10;
        log.debug(`password = ${password}`);
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return reject(err);
            bcrypt.hash(password, salt, function(err, hashPass) {
                if (err) return reject(err);
                resolve({
                    hashPass: hashPass,
                    salt: salt
                });
            });
        });
    });
}

exports.getHashPassBySalt = function({ password, salt }) {
    return new Promise((resolve, reject) => {
        if (!password || !salt) reject(new Error('getHashPassBySalt no params'));
        var bcrypt = require('bcrypt');
        const saltRounds = 10;
        log.debug(`password = ${password}`);
        bcrypt.hash(password, salt, function(err, hashPass) {
            if (err) reject(err);
            resolve(hashPass);
        });
    });
}