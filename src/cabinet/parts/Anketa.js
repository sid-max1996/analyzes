const auth = require('../../front_modules/service/auth');
const user = require('../../front_modules/service/user');
const helper = require('../../front_modules/helper');

export default {
    data() {
        return {
            firstName: null,
            secondName: null,
            phone: null,
            city: null,
            workPlace: null,
            aboutYourself: null,
            photo: null,
            errorCode: 0,
            errorText: null
        };
    },
    created: function() {
        this.fetchData();
    },
    methods: {
        fetchData: function() {
            let self = this;
            auth.nextAccess()
                .then(user.getAnketaData)
                .then((anketaData) => {
                    self.firstName = helper.jsonNullFilter(anketaData.firstName);
                    self.secondName = helper.jsonNullFilter(anketaData.secondName);
                    self.phone = helper.jsonNullFilter(anketaData.phone);
                    self.city = helper.jsonNullFilter(anketaData.city);
                    self.workPlace = helper.jsonNullFilter(anketaData.workPlace);
                    self.aboutYourself = helper.jsonNullFilter(anketaData.aboutYourself);
                })
                .catch((err) => console.log(err));
        },
        saveAnketa: function() {
            let self = this;
            auth.nextAccess()
                .then(() => Promise.resolve({
                    firstName: self.firstName,
                    secondName: self.secondName,
                    phone: self.phone,
                    city: self.city,
                    workPlace: self.workPlace,
                    aboutYourself: self.aboutYourself
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
                this.$refs.photo.value = null;
                this.photoPath = null;
            } else {
                if (self.errorCode == 1) {
                    self.errorText = null;
                    self.errorCode = 0;
                }
                this.photo = photo;
            }
        }
    }
}