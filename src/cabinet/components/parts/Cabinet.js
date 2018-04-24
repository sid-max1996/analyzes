const auth = require('../../../front_modules/service/auth');
const user = require('../../../front_modules/service/user');
const helper = require('../../../front_modules/helper');

export default {
    props: {
        cabinetInfo: {
            type: Object,
            default: function() {
                return {
                    userName: null,
                    roleName: null,
                    photoPath: null,
                    aboutYourself: null,
                    defaultPhotoPath: "img/profile.jpg"
                };
            }
        }
    },
}