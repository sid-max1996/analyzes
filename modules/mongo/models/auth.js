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

const createOrUpdateAuth = ({ Auth, auth }) => {
    return new Promise((resolve, reject) => {
        if (auth) {
            Auth.findByIdAndUpdate(auth._id, auth)
                .then((auth) => {
                    Auth.findById(auth._id)
                        .then((auth) => resolve(auth))
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        } else {
            let newAuth = new User(auth);
            newAuth.save().then((auth) => resolve(auth))
                .catch(err => reject(err));
        }
    });
};

schema.statics.create = function(auth, callback) {
    return new Promise((resolve, reject) => {
        let Auth = this;
        Auth.findOne({ id: auth.id })
            .then((auth) => Promise.resolve({ Auth: Auth, auth: auth }))
            .then(createOrUpdateAuth)
            .then((auth) => resolve(auth))
            .catch((err => {
                log.error(err.message);
                reject(err);
            }));
    });
};

module.exports.Auth = mongoose.model('Auth', schema);