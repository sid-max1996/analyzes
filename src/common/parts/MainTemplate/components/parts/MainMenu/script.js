const auth = require('../../../../../../front_modules/service/auth');
const info = require('../../../../../../front_modules/service/info');

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
                    curItemInd: 0,
                    isDarkScheme: false
                };
            }
        }
    },
    computed: {
        isWhiteScheme: function() {
            return !this.menuInfo.isDarkScheme;
        },
        isDarkScheme: {
            get: function() {
                return this.menuInfo.isDarkScheme;
            },
            set: function(value) {
                this.menuInfo.isDarkScheme = value;
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
            info.setSession('isDarkScheme', this.menuInfo.isDarkScheme);
        },
        getIsActiveItem: function(index) {
            return this.menuInfo.curItemInd === index;
        }
    }
}