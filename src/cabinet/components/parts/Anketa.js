const auth = require('../../../front_modules/service/auth');
const user = require('../../../front_modules/service/user');
const helper = require('../../../front_modules/helper');

export default {
    data() {
        return {
            errorCode: 0,
            errorText: null
        };
    },
    props: {
        anketaInfo: {
            type: Object,
            default: function() {
                return {
                    firstName: null,
                    secondName: null,
                    phone: null,
                    city: null,
                    workPlace: null,
                    aboutYourself: null,
                    photo: null
                };
            }
        }
    },
    methods: {
        saveAnketa: function() {
            let self = this;
            auth.nextAccess()
                .then(() => Promise.resolve({
                    firstName: self.anketaInfo.firstName,
                    secondName: self.anketaInfo.secondName,
                    phone: self.anketaInfo.phone,
                    city: self.anketaInfo.city,
                    workPlace: self.anketaInfo.workPlace,
                    aboutYourself: self.anketaInfo.aboutYourself
                }))
                .then(user.saveAnketa)
                .catch((err) => console.log(err));
        },
        photoSelect: function() {
            let photo = this.$refs.photo.files[0];
            console.log(photo.name + " " + photo.size);
            if (photo && photo.size / 1024 > 1000) {
                this.errorText = "Максимальный лимит на загрузку фото 1 Mb";
                this.errorCode = 1;
                this.anketaInfo.$refs.photo.value = null;
                this.anketaInfo.photoPath = null;
            } else {
                if (this.errorCode == 1) {
                    this.errorText = null;
                    this.errorCode = 0;
                }
                this.anketaInfo.photo = photo;
            }
        }
    }
}