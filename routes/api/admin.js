const protect = require(appRoot + "/modules/protect.js");
const usersDb = require(appRoot + '/modules/fireburd/users');
//const session = require(appRoot + '/modules/session');
const log = require(appRoot + '/modules/log')(module);

exports.addUser = function(req, res, next) {
    const pool = usersDb.pool;
    let login = req.body.login;
    let password = req.body.password;
    let email = req.body.email;
    log.debug(`login = ${login} password = ${password} email = ${email}`);
    protect.getHashPassAndSalt(password, function(err, resObj) {
        if (err) {
            log.error(err);
            return next(err);
        }
        log.debug(`pool = ${pool}`);
        pool.get(function(err, db) {
            if (err) {
                log.error(err.message);
                return next(err);
            }
            log.debug(`login = ${login} password = ${password} email = ${email}`);
            log.debug(`hashPass = ${resObj.hashPass} salt = ${resObj.salt}`);
            db.query('execute procedure proc_add_user(?,?,?,?)', [login, email, resObj.hashPass, resObj.salt],
                function(err, result) {
                    if (err) {
                        log.error(err.message);
                        return next(new HttpError(406, err.message));
                    }
                    log.debug(result.user_id);
                    db.detach();
                    res.send({ result: result });
                });
        });
    });
}