const log = require('../../../log')(module);

exports.getPhotoUrl = function(streamFun) {
    return new Promise((resolve, reject) => {
        if (!streamFun) resolve(null);
        streamFun(function(err, name, e) {
            if (err) reject(err);
            let photoUrl = "";
            e.on('data', function(chunk) {
                photoUrl += chunk.toString('utf8');
            });
            e.on('end', function() {
                log.debug(`getPhotoUrl: photoUrl.length = ${photoUrl.length}`);
                resolve(photoUrl);
            });
        });
    });
}