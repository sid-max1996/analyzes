const front = require('../../../../../core/front');
const lib = require('../../../../../core/lib');
const auth = front.serv.auth;
const cabinet = front.serv.cabinet;
const Validator = lib.valid.Validator;
const check = lib.valid.check;
const media = front.help.media;
const alert = front.comp.alert;


import Alert from '../../../../../core/front/modules/comp/Alert/main.vue'

export default {
    data() {
        return {
            isAlert: false,
            alertText: null,
            alertInfo: null,
            password1: null,
            password2: null,
            photoUrl: null,
            validator: new Validator(),
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
            alert.showError(this.validator.isError, this, this.validator.errText,
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
                    .then(cabinet.saveSettings)
                    .then(answer => {
                        alert.showToggle(answer.success, this, answer.error, 'данные сохранены',
                            'alertInfo', 'alertText', 'isAlert');
                    })
                    .catch((err) => console.log(err));
            } else alert.showError(true, this, 'ранее были ошибки, которые не были исправлены',
                'alertInfo', 'alertText', 'isAlert');
        },
        passErrorsCheck: function() {
            let { password1, password2 } = this;
            if (password1.length !== 0) {
                let checkers = [check.isPassword, check.isEqInArr];
                let params = [password1, [password1, password2]];
                let errors = ['Длина пароля должна быть не менее 8 символов', 'Введенные пароли не совпадают'];
                this.validator.check(checkers, params, errors);
            }
            this.showErrors();
        },
        photoSelect: function() {
            let validator = this.validator;
            let photo = this.$refs.photo.files[0];
            console.log(photo.name + " " + photo.size);
            validator.checkVal(check.isImgSizeLimit, { img: photo, maxKb: 1000 }, 'Максимальный лимит на загрузку фото 1 Mb');
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