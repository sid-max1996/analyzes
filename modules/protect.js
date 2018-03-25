const crypto = require("crypto");

module.exports.getSecretKey = (value, algorithm = 'sha256') => {
    let secretKey = crypto.randomBytes(10).toString('hex');
    let hmac = crypto.createHmac(algorithm, secretKey);
    hmac.update(value);
    let hash = hmac.digest('hex');
    console.log('hash: ' + hash);
    return [secretKey, hash];
} 

module.exports.decrypt = (text, secret, algorithm = 'aes-256-ctr') => {
    let decipher = crypto.createDecipher(algorithm, secret)
    let dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

/*----------------------*/

module.exports.setCryptoUserSecretKeyAndHash = (secretkey, hash) => console.log('set hash in local storadge');

module.exports.checkPasswordById = (userId, password) => true;
