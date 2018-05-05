const session = require(appRoot + '/modules/session');
const helper = require(appRoot + '/modules/helper');
const log = require(appRoot + '/modules/log')(module);


//getCabinetData section
exports.setCabinetParams = function(userId) {
    log.debug(`setCabinetParams: userId = ${userId}`);
    return Promise.resolve({
        query: 'execute procedure get_user_info(?)',
        params: [userId]
    });
}

exports.getCabinetData = (result) => {
    log.debug(`getCabinetData: result = ${result}`);
    console.log(result);
    return new Promise((resolve, reject) => {
        if (!result.user_photo) {
            let userData = {
                userName: helper.trimOrNull(result.user_name),
                roleName: helper.trimOrNull(result.role_name),
                aboutYourself: helper.trimOrNull(result.about_yourself),
                photoUrl: result.user_photo
            };
            resolve(userData);
        } else {
            result.user_photo(function(err, name, e) {
                if (err)
                    reject(err);

                let photoUrl = "";
                e.on('data', function(chunk) {
                    photoUrl += chunk.toString('utf8');
                });

                e.on('end', function() {
                    log.debug(`getUserData: photoUrl.length = ${photoUrl.length}`);
                    let userData = {
                        userName: helper.trimOrNull(result.user_name),
                        roleName: helper.trimOrNull(result.role_name),
                        aboutYourself: helper.trimOrNull(result.about_yourself),
                        photoUrl: photoUrl
                    };
                    resolve(userData);
                });
            });
        }
    });
}

//getAnketaData section
exports.setAnketaParams = function(userId) {
    log.debug(`setAnketaParams: userId = ${userId}`);
    return Promise.resolve({
        query: 'execute procedure get_user_anketa(?)',
        params: [userId]
    });
}

exports.getAnketaData = (result) => {
    log.debug(`getUserAnketa: result = ${result}`);
    console.log(result);
    return new Promise((resolve, reject) => {
        let anketaData = {
            firstName: helper.trimOrNull(result.first_name),
            secondName: helper.trimOrNull(result.second_name),
            phone: helper.trimOrNull(result.phone),
            city: helper.trimOrNull(result.city),
            workPlace: helper.trimOrNull(result.work_place),
            aboutYourself: helper.trimOrNull(result.about_yourself)
        };
        resolve(anketaData);
    });
}

//saveAnketaData section
exports.saveAnketaParams = function(params) {
    log.debug(`saveAnketaParams: params = ${params}`);
    let { userId, firstName, secondName, phone, city, workPlace, aboutYourself } = params;
    return Promise.resolve({
        query: 'execute procedure update_anketa(?,?,?,?,?,?,?)',
        params: [userId, firstName, secondName, phone, city, workPlace, aboutYourself]
    });
}

//getSettingsData
exports.setSettingsParams = function(userId) {
    log.debug(`setSettingsParams: userId = ${userId}`);
    return Promise.resolve({
        query: 'execute procedure get_user_settings(?)',
        params: [userId]
    });
}

exports.getSettingsData = (result) => {
    log.debug(`getUserSettings: result = ${result}`);
    console.log(result);
    return new Promise((resolve, reject) => {
        let userData = {
            email: helper.trimOrNull(result.email)
        };
        resolve(userData);
    });
}

//saveSettingsData
const saveSettingsPassword = function(password, queryArgs) {
    log.debug(`saveSettingsPassword: queryArgs = ${queryArgs}`);
    console.log(queryArgs);
    return new Promise((resolve, reject) => {
        if (!helper.isEmptyOrNull(password)) {
            const protect = require(appRoot + "/modules/protect.js");
            protect.getHashPassAndSalt(password)
                .then((protectData) => {
                    queryArgs[2] = protectData.hashPass;
                    queryArgs[3] = protectData.salt;
                    resolve();
                })
                .catch((err) => reject(err));
        } else resolve();
    });
}

const saveSettingsPhoto = function({ photoUrl, queryArgs }) {
    log.debug(`saveSettingsPhoto: queryArgs = ${queryArgs}`);
    console.log(queryArgs);
    return new Promise((resolve, reject) => {
        if (!helper.isEmptyOrNull(photoUrl)) {
            queryArgs[4] = photoUrl;
            resolve();
        } else resolve();
    });
}

exports.saveSettingsParams = function(params) {
    log.debug(`saveSettingsParams: params = ${params}`);
    let { userId, email, password, photoUrl } = params;
    let queryArgs = [userId, email, null, null, null];
    return new Promise((resolve, reject) => {
        saveSettingsPassword(password, queryArgs)
            .then(() => Promise.resolve({
                photoUrl: photoUrl,
                queryArgs: queryArgs
            }))
            .then(saveSettingsPhoto)
            .then(() => resolve({
                query: `execute procedure update_settings(?, ?, ?, ?, ?)`,
                params: queryArgs
            }))
            .catch((err) => reject(err));
    });
}