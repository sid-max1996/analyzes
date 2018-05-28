const log = require('../../../log')(module);
const error = require('../../../error');
const HideError = error.HideError;
const query = require('../query');
const lib = require('../../../../../lib');
const meta = lib.meta;

exports.thenData = function(pool, method, params) {
    return new Promise((resolve, reject) => {
        exports.create(pool)
            .then((tran) => Promise.resolve(query.paramThen(method, meta.object.setProp(params, 'tran', tran))))
            .then(query.thenData)
            .then((out) => {
                if (out.success) exports.commit(params.tran).then(() => resolve(out)).catch(err => reject(err));
                else exports.rollback(params.tran).then(() => resolve(out)).catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}

const getDb = (pool) => {
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

const getTransaction = (db) => {
    log.debug(`getTransaction: db = ${db}`);
    return new Promise((resolve, reject) => {
        db.transaction(function(err, tran) {
            if (err) {
                log.error(err.message);
                reject(new HideError('getTransaction fun error'));
            }
            resolve(tran);
        });
    });
}

exports.create = (pool) => {
    return new Promise((resolve, reject) => {
        getDb(pool)
            .then(getTransaction)
            .then(tran => resolve(tran))
            .catch(err => reject(err));
    });
}

exports.commit = (tran) => {
    return new Promise((resolve, reject) => {
        tran.commit((err) => {
            if (err) {
                tran.rollback();
                tran.db.detach();
                reject(new HideError('transaction commit error'));
            } else {
                tran.db.detach();
                resolve();
            }
        });
    });
}

exports.rollback = (tran) => {
    return new Promise((resolve, reject) => {
        tran.rollback();
        tran.db.detach();
        resolve();
    });
}