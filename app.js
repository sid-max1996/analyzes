const cluster = require('cluster');
const log = require('./modules/log')(module);

function startWorker() {
    let worker = cluster.fork();
    log.info('КЛАСТЕР: Исполнитель %d запущен', worker.id);
}

if (cluster.isMaster) {
    require('os').cpus().forEach(function() {
        startWorker();
    });

    cluster.on('disconnect', function(worker) {
        log.info('КЛАСТЕР: Исполнитель %d отключился откластера.', worker.id);
    });
    // Когда исполнитель завершает работу, создаем исполнителя ему на замену
    cluster.on('exit', function(worker, code, signal) {
        log.info('КЛАСТЕР: Исполнитель %d завершил работу с кодом завершения %d', worker.id, code);
        startWorker();
    });
} else {
    require('./server.js')();
}