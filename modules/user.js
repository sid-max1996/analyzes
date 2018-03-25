
module.exports.makeLocalStoradgeUser = (login, bdPassword) => 'idLocalBd';

module.exports.getLoginById = (userId) => 'user';

module.exports.getPasswordById = (userId) => 'password';

module.exports.getSecretById = (userId) => 'secret';

module.exports.existByLogin = (login) => true;

module.exports.existById = (userId) => true;