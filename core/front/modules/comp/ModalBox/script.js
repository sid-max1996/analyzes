export default {
    data() {
        return {};
    },
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        btnText: {
            type: String,
            default: null
        },
        title: {
            type: String,
            default: ''
        },
        text: {
            type: String,
            default: ''
        },
    },
    computed: {
        showClass: function() {
            return this.isShow ? 'show' : 'fade';
        }
    },
    methods: {
        doClose: function() {
            this.$emit('closeEvent');
        },
        btnClick: function() {
            this.$emit('btnClick');
        }
    }
}