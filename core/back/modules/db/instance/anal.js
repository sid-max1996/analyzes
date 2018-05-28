const firebird = require('node-firebird');
const config = require('../../config');
const log = require('../../log')(module);

var options = {};

options.host = config.get('fireburd:host');
options.port = config.get('fireburd:port');
options.database = 'C:\\Projects\\analyzes\\db\\ANALYZES.FDB';
options.user = 'SYSDBA';
options.password = 'masterkey';
options.lowercase_keys = config.get('fireburd:lowerCaseKeys');
options.role = config.get('fireburd:role');
options.pageSize = config.get('fireburd:pageSize');

var pool = firebird.pool(config.get('fireburd:maxPoolCount'), options);

module.exports = pool;