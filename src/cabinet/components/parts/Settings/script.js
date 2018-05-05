const auth = require('../../../../front_modules/service/auth');
const users = require('../../../../front_modules/service/users');
const front = require('../../../../front_modules/front');
const valid = require('../../../../front_modules/data/valid');
const media = require('../../../../front_modules/helper/media');

import Alert from '../../../../common/Alert.vue'

export default {
    data() {
        return {
            isAlert: false,
            alertText: null,
            alertInfo: null,
            password1: null,
            password2: null,
            photoUrl: null,
            validator: new valid.Validator(),
            isError: false
        };
    },
    components: {
        'Alert': Alert
    },
    computed: {
        contentInfo: function() {
            return this.$store.state.settingsInfo;
        }
    },
    methods: {
        showErrors: function() {
            front.showAlertError(this.validator.isError, this, this.validator.errText,
                'alertInfo', 'alertText', 'isAlert');
            this.isError = this.validator.isError;
            this.validator.clear();
        },
        saveSettings: function() {
            let self = this;
            if (!this.isError) {
                auth.nextAccess()
                    .then(() => {
                        return Promise.resolve({
                            email: self.contentInfo.email,
                            password: self.password1,
                            photoUrl: self.photoUrl
                        })
                    })
                    .then(users.saveSettings)
                    .then(answer => {
                        front.showAlertToggle(answer.success, this, answer.error, 'данные сохранены',
                            'alertInfo', 'alertText', 'isAlert');
                    })
                    .catch((err) => console.log(err));
            } else front.showAlertError(true, this, 'ранее были ошибки, которые не были исправлены',
                'alertInfo', 'alertText', 'isAlert');
        },
        passErrorsCheck: function() {
            let { password1, password2 } = this;
            if (password1.length !== 0)
                this.validator.doValidMany(
                    ['Длина пароля должна быть не менее 8 символов', 'Введенные пароли не совпадают'], [valid.checkPassword, valid.checkEqual], [password1, [password1, password2]]
                );
            this.showErrors();
        },
        photoSelect: function() {
            let validator = this.validator;
            let photo = this.$refs.photo.files[0];
            console.log(photo.name + " " + photo.size);
            validator.doValidOnce('Максимальный лимит на загрузку фото 1 Mb', valid.checkImgSize, { img: photo, maxKb: 1000 });
            if (validator.isError) {
                this.$refs.photo.value = null;
            } else {
                media.imgToBase64(photo)
                    .then((dataUri) => this.photoUrl = dataUri)
                    .catch(err => front.showAlertError(true, this, err.message,
                        'alertInfo', 'alertText', 'isAlert'));
            }
            this.showErrors();
        }
    }
}