const front = require('../../../../core/front');
const auth = front.serv.auth;
const stat = front.serv.stat;
const info = front.serv.info;
const coreLib = require('../../../../core/lib');
const array = coreLib.meta.array;
const object = coreLib.meta.object;
const objArr = coreLib.meta.objArr;
const check = coreLib.valid.check;


import List from '../../../../core/front/modules/comp/List/main.vue'
import Pagination from '../../../../core/front/modules/comp/Pagination/main.vue'

export default {
    data() {
        return {
            commInd: 0,
            src: '/statistics/selection',
            rowCount: 0,
            titles: ['название', 'группа', '', ''],
            btns: [
                { title: 'установить текущей', class: "btn-primary", event: "selChange" },
                { title: 'удалить', class: 'btn btn-danger', event: "selRemove" }
            ],
            selName: "",
            lastFilter: {}
        };
    },
    created: function() {
        this.rowCount = this.$store.state.default.rowCount;
    },
    computed: {
        data: function() {
            let selData = this.$store.state.selectionsData;
            console.log(selData);
            if (check.notNull(selData.data)) {
                if (selData.data.length === 0 && this.curPage !== 1) {
                    window.location.replace(front.lib.ajax.SERVER_ADDRESS + 'statistics/selection/1');
                    return [];
                }
                let data = objArr.clone(selData.data);
                console.log(data);
                let props = ['selName', 'groupName'];
                return objArr.intoPropsArrList(data, props);
            } else return [];
        },
        curPage: function() {
            return Number(this.$route.params.pageNum);
        },
        allCount: function() {
            return this.$store.state.selectionsData ? this.$store.state.selectionsData.count : 0;
        }
    },
    components: {
        'Pagination': Pagination,
        'List': List
    },
    methods: {
        changeData: function(params) {
            this.$emit('changeData', this.commInd, params);
        },
        pageChange: function(value) {
            console.log('pageChange chsnge = ' + value);
            this.changeData({ pageNum: value, rowCount: this.rowCount, filter: this.lastFilter });
        },
        filterChange: function(event) {
            if (event.keyCode == 13) {
                this.lastFilter = { selName: this.selName };
                this.pageChange(this.curPage);
            }
        },
        filterBtnClick: function() {
            this.lastFilter = { selName: this.selName };
            this.pageChange(this.curPage);
        },
        selChange: function(ind) {
            let sel = this.$store.state.selectionsData.data[ind];
            let newSel = { id: sel.selId, name: sel.selName };
            console.log(newSel);
            info.setSession('workSel', newSel)
                .then(answer => {
                    this.$store.state.curSel = newSel;
                    window.location.reload();
                })
                .catch(err => console.log(err));
        },
        selRemove: function(ind) {
            console.log('selRemove: ' + ind);
            let remSel = this.$store.state.selectionsData.data[ind];
            auth.nextAccess()
                .then(() => stat.removeSel(remSel.selId))
                .then((answer) => {
                    if (answer.success === false)
                        modal.show(this, answer.error, 'isShowModal', 'modalText');
                    else if (this.$store.state.curSel.id === remSel.selId) {
                        info.setSession('workSel', null)
                            .then(answer => window.location.reload())
                    } else return Promise.resolve();
                })
                .then(answer => this.changeData())
                .catch(err => console.log(err));
        }
    }
}