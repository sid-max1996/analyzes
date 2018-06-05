export default {
    data() {
        return {};
    },
    props: {
        cols: {
            type: Array,
            default: function() { return [] }
        },
        btn: {
            type: Object,
            default: function() { return {} }
        }
    },
    methods: {
        btnClick: function(eventName, event) {
            console.log(eventName);
            let target = $(event.target);
            let th = $(target.parent()[0]);
            let tr = $(th.parent()[0]);
            let checkArr = tr.find('input:checkbox:checked.ch-cols');
            let ret = [];
            checkArr.each((ind, item) => {
                item.checked = false;
                let check = $(item);
                let i = check.attr('data-id');
                ret.push(this.cols[i]);
            });
            this.$emit(eventName, ret);
        }
    }
}