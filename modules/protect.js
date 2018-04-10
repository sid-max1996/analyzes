const crypto = require("crypto");
const log = require(appRoot + '/modules/log')(module);

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

exports.getHashPassAndSalt = function(password, callback) {
    var bcrypt = require('bcrypt');
    const saltRounds = 10;
    log.debug(`password = ${password}`);
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) return callback(err);

        bcrypt.hash(password, salt, function(err, hashPass) {
            if (err) return callback(err);
            callback(null, {
                hashPass: hashPass,
                salt: salt
            });
        });
    });
}

exports.getHashPassBySalt = function({ password, salt }) {
    return new Promise((resolve, reject) => {
        var bcrypt = require('bcrypt');
        const saltRounds = 10;
        log.debug(`password = ${password}`);
        bcrypt.hash(password, salt, function(err, hashPass) {
            if (err) reject(err);
            resolve(hashPass);
        });
    });
}