const log = require('../../../../log')(module);
const error = require('../../../../error');
const ShowError = error.ShowError;
const HideError = error.HideError;

exports.getDb = (pool) => {
    log.debug(`getDb: pool = ${pool}`);
    return new Promise((resolve, reject) => {
        pool.get(function(err, db) {
            if (err) {
                log.error(err.message);
                reject(new HideError('getDb fun error'));
            }
            resolve(db);
        });
    });
}

exports.getDbs = (pools) => {
    log.debug(`getDbs: pools = ${pools}`);
    return new Promise((resolve, reject) => {
        let promises = [];
        pools.forEach(pool => promises.push(exports.getDb(pool)));
        Promise.all(promises)
            .then(dbs => resolve(dbs))
            .catch(err => {
                log.error(err.message);
                reject(new HideError('getDbs fun error'));
            });
    });
}

exports.dbQuery = ({ db, query, params }) => {
    log.debug(`dbQuery: db = ${db}, query = ${query}, params = ${params}`);
    console.log(params);
    return new Promise((resolve, reject) => {
        db.transaction(function(err, transaction) {
            transaction.query(query, params,
                function(err, result) {
                    log.debug(`dbQuery: result = ${result}`);
                    console.log(result);
                    if (err) {
                        transaction.rollback();
                        log.error(err.message);
                        reject(new HideError('dbQuery fun error'));
                    }
                    transaction.commit(function(err) {
                        if (err) transaction.rollback();
                        else {
                            db.detach();
                            resolve(result);
                        }
                    });
                });
        });
    });
}

/*-------------------------------*/
exports.dbQueryTr = ({ tran, query, params }) => {
    log.debug(`dbQuery: tran = ${tran}, query = ${query}, params = ${params}`);
    console.log(params);
    return new Promise((resolve, reject) => {
        tran.query(query, params,
            function(err, result) {
                log.debug(`dbQueryTr: result = ${result}`);
                console.log(result);
                if (err) {
                    log.error(err.message);
                    reject(new HideError('dbQuery fun error'));
                } else resolve(result);
            });
    });
}