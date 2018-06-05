const front = require('../../../../core/front');
const auth = front.serv.auth;
const stat = front.serv.stat;
const info = front.serv.info;
const coreLib = require('../../../../core/lib');
const array = coreLib.meta.array;
const object = coreLib.meta.object;
const alert = front.comp.alert;
const objArr = coreLib.meta.objArr;
const check = coreLib.valid.check;

import Alert from '../../../../core/front/modules/comp/Alert/main.vue'
import List from '../../../../core/front/modules/comp/List/main.vue'
import Pagination from '../../../../core/front/modules/comp/Pagination/main.vue'

export default {
    data() {
        return {
            commInd: 1,
            isAlert: false,
            alertText: null,
            alertInfo: null,
            selName: null,
            curGroup: {},
            titles: ['название', ''],
            btns: [
                { title: 'выбрать', class: "btn-class", event: "setGroup" }
            ],
            curPage: 1
        };
    },
    components: {
        'Alert': Alert,
        'List': List,
        'Pagination': Pagination
    },
    computed: {
        data: function() {
            let groups = this.$store.state.addSelectionInfo.groups;
            groups = groups ? groups : [];
            return objArr.intoPropsArrList(groups, ['groupName']);
        },
        rowCount: function() {
            return this.$store.state.default.rowCount;
        },
        allCount: function() {
            let addSelectionInfo = this.$store.state.addSelectionInfo;
            return addSelectionInfo ? addSelectionInfo.groupsCount : 0;
        }
    },
    methods: {
        changeData: function(params) {
            this.$emit('changeData', this.commInd, params);
        },
        pageChange: function(value) {
            console.log('pageChange chsnge = ' + value);
            this.changeData({ pageNum: value, rowCount: this.rowCount });
        },
        addSelection: function() {
            let self = this;
            console.log(self.curGroup.groupId);
            if (check.isEmpty(self.selName))
                alert.showError(true, self, 'пустое имя', 'alertInfo', 'alertText', 'isAlert');
            else if (!check.isNum(self.curGroup.groupId))
                alert.showError(true, self, 'группа не выбрана', 'alertInfo', 'alertText', 'isAlert');
            else {
                auth.nextAccess()
                    .then(() => Promise.resolve({
                        selName: self.selName,
                        groupId: self.curGroup.groupId
                    }))
                    .then(stat.addSelection)
                    .then(answer => {
                        alert.showToggle(answer.success, self, answer.error, 'выборка добавлена',
                            'alertInfo', 'alertText', 'isAlert');
                        if (answer.success) {
                            this.selName = '';
                            this.curGroup = {};
                        }
                    })
                    .catch((err) => {
                        alert.showError(true, self, 'непредвиденная ошибка', 'alertInfo', 'alertText', 'isAlert');
                        console.log(err);
                    });
            }
        },
        setGroup: function(ind) {
            console.log('setGroup: ' + ind);
            this.curGroup = this.$store.state.addSelectionInfo.groups[ind];
        }
    }
}