const mongoose = require('../index.js');
const appRoot = require('../../../config').get('rootDir');
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
    accessString: {
        type: String,
        required: true
    },
    isAuthorize: {
        type: Boolean,
        default: false
    },
    isAccess: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

schema.statics.create = function(userData, callback) {
    let User = this;
    User.findOne({ id: userData.id }, function(err, user) {
        log.debug(`findOne user = ${user}, err = ${err}`);
        if (err) {
            log.debug(`err = ${err}`);
            callback(err);
        }
        if (user) {
            User.findByIdAndUpdate(user._id, userData, function(err, user) {
                if (err) {
                    log.debug(`err = ${err}`);
                    callback(err);
                } else {
                    User.findById(user._id, function(err, user) {
                        if (err) {
                            log.debug(`err = ${err}`);
                            callback(err);
                        } else {
                            callback(null, user);
                        }
                    });
                }
            });
        } else {
            let user = new User(userData);
            user.save(callback);
        }
    });
};

exports.User = mongoose.model('User', schema);