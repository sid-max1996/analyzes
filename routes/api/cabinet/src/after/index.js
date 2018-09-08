const back = require('../../../../../core/back');
const lib = require('../../../../../core/lib');
const log = back.log(module);
const object = lib.meta.object;
const array = lib.meta.array;
const modif = lib.modif;
const media = back.db.media;
const query = back.db.query;

exports.getCabinet = (result) => {
    log.debug(`after: getCabinet: result = ${result}`);
    return new Promise((resolve, reject) => {
        let userData = lib.meta.object.propsFunRename(result, modif.filters.cToCamel)
        media.getPhotoUrl(result.userPhoto)
            .then(photoUrl => resolve(object.setProps(userData, ['photoUrl'], [photoUrl])))
            .catch(err => resolve(err))
    });
}

exports.getAnketa = (result) => {
    log.debug(`after: getAnketa: result = ${result}`);
    return Promise.resolve(lib.meta.object.propsFunRename(result, modif.filters.cToCamel));
}

exports.saveAnketa = (result) => {
    return Promise.resolve(query.jsonSucc(result));
}

exports.getSettings = (result) => {
    log.debug(`after: getSettings: result = ${result}`);
    return Promise.resolve(object.create(['email'], [result.email]));
}

exports.saveSettings = (result) => {
    log.debug(`after: getAnketa: result = ${result}`);
    return Promise.resolve(query.jsonSucc(result));
}