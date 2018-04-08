const log = require('../modules/log')(module);

module.exports = function(req, res, next) {
    let cluster = require('cluster');
    if (cluster.isWorker)
        log.info('Исполнитель %d получил запрос', cluster.worker.id);
    next();
};