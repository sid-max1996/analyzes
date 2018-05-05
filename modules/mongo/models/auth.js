const mongoose = require('../index.js');
const appRoot = require('../../../config').get('rootDir');
const authConfig = require('../../../config').get('authConfig');
const Schema = mongoose.Schema;
const log = require(appRoot + '/modules/log')(module);

var schema = new Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    login: {
        type: String,
        unique: true,
        required: true
    },
    secret: {
        type: String,
        required: true
    },
    tryCount: {
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

const createOrUpdateAuth = ({ Auth, oldAuth, newAuthObj }) => {
    return new Promise((resolve, reject) => {
        if (oldAuth) {
            Auth.findByIdAndUpdate(oldAuth._id, newAuthObj)
                .then((auth) => {
                    Auth.findById(auth._id)
                        .then((auth) => resolve(auth))
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        } else {
            let newAuth = new Auth(newAuthObj);
            newAuth.save().then((auth) => resolve(auth))
                .catch(err => reject(err));
        }
    });
};

schema.statics.create = function(newAuthObj, callback) {
    return new Promise((resolve, reject) => {
        let Auth = this;
        Auth.findOne({ id: newAuthObj.id })
            .then((oldAuth) => Promise.resolve({ Auth: Auth, oldAuth: oldAuth, newAuthObj: newAuthObj }))
            .then(createOrUpdateAuth)
            .then((resAuth) => resolve(resAuth))
            .catch((err => {
                log.error(err.message);
                reject(err);
            }));
    });
};

module.exports.Auth = mongoose.model('Auth', schema);