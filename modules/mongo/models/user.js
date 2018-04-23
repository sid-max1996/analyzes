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
    },
    isDarkScheme: {
        type: Boolean,
        default: false
    }
}, { versionKey: false });

const createOrUpdateUser = ({ User, user }) => {
    return new Promise((resolve, reject) => {
        if (user) {
            User.findByIdAndUpdate(user._id, user)
                .then((user) => {
                    User.findById(user._id)
                        .then((user) => resolve(user))
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        } else {
            let newUser = new User(user);
            newUser.save().then((user) => resolve(user))
                .catch(err => reject(err));
        }
    });
};

schema.statics.create = function(user) {
    return new Promise((resolve, reject) => {
        let User = this;
        User.findOne({ id: user.id })
            .then((user) => Promise.resolve({ User: User, user: user }))
            .then(createOrUpdateUser)
            .then((user) => resolve(user))
            .catch((err => {
                log.error(err.message);
                reject(err);
            }));
    });
};

exports.User = mongoose.model('User', schema);