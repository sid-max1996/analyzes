const auth = require('../../../front_modules/service/auth');
const session = require('../../../front_modules/service/session');

export default {
    data() {
        return {
            noticeCount: 0
        };
    },
    props: {
        menuInfo: {
            type: Object,
            default: function() {
                return {
                    isDarkScheme: false
                };
            }
        }
    },
    methods: {
        doLogout: function() {
            auth.nextAccess()
                .then(auth.doLogout)
                .catch((err) => console.log(err));
        },
        switchColorScheme: function() {
            if (this.menuInfo.isDarkScheme) {
                $("body").removeClass('bodyLight');
                $("body").addClass('bodyDark');
            } else {
                $("body").removeClass('bodyDark');
                $("body").addClass('bodyLight');
            }
            session.setValue('isDarkScheme', this.menuInfo.isDarkScheme);
        }
    }
}