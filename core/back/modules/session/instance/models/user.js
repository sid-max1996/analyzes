const mongoose = require('../index');
const Schema = mongoose.Schema;

const log = require('../../../log')(module);

var schema = new Schema({
    id: {
        type: Number,
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
    colorScheme: {
        type: String,
        default: 'light'
    },
    workGroup: {
        type: Object,
        default: null
    }
}, { versionKey: false });

const createOrUpdateUser = ({ User, oldUser, newUserObj }) => {
    return new Promise((resolve, reject) => {
        if (oldUser) {
            User.findByIdAndUpdate(oldUser._id, newUserObj)
                .then((user) => {
                    User.findById(user._id)
                        .then((user) => resolve(user))
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        } else {
            let newUser = new User(newUserObj);
            newUser.save().then((user) => resolve(user))
                .catch(err => reject(err));
        }
    });
};

schema.statics.create = function(newUserObj) {
    return new Promise((resolve, reject) => {
        let User = this;
        User.findOne({ id: newUserObj.id })
            .then((oldUser) => Promise.resolve({ User: User, oldUser: oldUser, newUserObj: newUserObj }))
            .then(createOrUpdateUser)
            .then((resUser) => resolve(resUser))
            .catch((err => {
                log.error(err.message);
                reject(err);
            }));
    });
};

module.exports = mongoose.model('User', schema);