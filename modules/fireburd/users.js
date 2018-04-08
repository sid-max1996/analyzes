const firebird = require('node-firebird');
const config = require('../../config');
const log = require('../log')(module);

var options = {};

options.host = '127.0.0.1';
options.port = 3050;
options.database = 'C:\\Projects\\analyzes\\db\\USERS.FDB';
options.user = 'SYSDBA';
options.password = 'masterkey';
options.lowercase_keys = true;
options.role = null;
options.pageSize = 4096;

var pool = firebird.pool(config.get('fireburd:maxPoolCount'), options);

exports.pool = pool;
exports.destroy = function() {
    log.info('USERS.FDB pool destroy');
    pool.destroy();
}