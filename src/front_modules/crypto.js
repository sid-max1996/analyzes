const crypto = require("crypto");

module.exports.makeHash = (value, secret, algorithm = 'sha256') => {
    let hmac = crypto.createHmac(algorithm, secret);
    hmac.update(value);
    let hash = hmac.digest('hex');
    return hash;
}

module.exports.encrypt = (text, secret, algorithm = 'aes-256-ctr') => {
  let cipher = crypto.createCipher(algorithm, secret);
  let crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}
 