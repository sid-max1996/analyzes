const front = require('../../../../core/front');
const auth = front.serv.auth;
const anal = front.serv.anal;
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
            src: '/analyzes/group',
            rowCount: 0,
            titles: ['название', 'создатель', 'участники', ''],
            btns: [{ title: 'установить текущей', class: "btn-primary", event: "groupChange" }],
            groupName: "",
            lastFilter: {}
        };
    },
    created: function() {
        this.rowCount = this.$store.state.default.rowCount;
    },
    computed: {
        data: function() {
            let groupsData = this.$store.state.groupsData;
            console.log(groupsData);
            if (check.notNull(groupsData.data)) {
                if (groupsData.data.length === 0 && this.curPage !== 1) {
                    window.location.replace(front.lib.ajax.SERVER_ADDRESS + 'analyzes/group/1');
                    return [];
                }
                let data = objArr.clone(groupsData.data);
                console.log(data);
                data.forEach((el, ind) => {
                    data[ind].users = array.toStr(el.users, ",");
                });
                let props = ['groupName', 'creator', 'users'];
                return objArr.intoPropsArrList(data, props);
            } else return [];
        },
        curPage: function() {
            return Number(this.$route.params.pageNum);
        },
        allCount: function() {
            return this.$store.state.groupsData ? this.$store.state.groupsData.count : 0;
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
                this.lastFilter = { groupName: this.groupName };
                this.pageChange(this.curPage);
            }
        },
        filterBtnClick: function() {
            this.lastFilter = { groupName: this.groupName };
            this.pageChange(this.curPage);
        },
        groupChange: function(ind) {
            let group = this.$store.state.groupsData.data[ind];
            let newGroup = { id: group.groupId, name: group.groupName };
            console.log(newGroup);
            info.setSession('workGroup', newGroup)
                .then(answer => {
                    this.$store.state.curGroup = newGroup;
                    window.location.reload();
                })
                .catch(err => console.log(err));
        }
    }
}