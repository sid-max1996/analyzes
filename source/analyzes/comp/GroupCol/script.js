const front = require('../../../../core/front');
const info = front.serv.info;
const auth = front.serv.auth;
const anal = front.serv.anal;
const modal = front.comp.modal;
const coreLib = require('../../../../core/lib');
const array = coreLib.meta.array;
const object = coreLib.meta.object;
const objArr = coreLib.meta.objArr;
const check = coreLib.valid.check;
const table = front.comp.table;

import ModalBox from '../../../../core/front/modules/comp/ModalBox/main.vue'

export default {
    data() {
        return {
            isShowModal: false,
            btnText: 'Ок',
            modalTitle: '',
            modalText: '',
            type: '',
            id: -1,
            colName: '',
            colOptions: [],
            colAddOp: []
        };
    },
    created: function() {
        console.log('GroupCol created');
        this.type = this.$route.params.type;
        this.id = this.$route.params.id;
        console.log(this.type);
        console.log(this.id);
        this.getInfo();
    },
    components: {
        'ModalBox': ModalBox
    },
    computed: {},
    methods: {
        modalClose: function() {
            modal.hide(this, 'isShowModal', 'modalText');
        },
        getInfo: function() {
            anal.getColInfo({ id: this.id, type: this.type })
                .then(answer => {
                    if (answer.success === false)
                        modal.show(this, answer.error, 'isShowModal', 'modalText');
                    else {
                        this.colName = answer.colName;
                        this.colOptions = answer.colOptions;
                        this.colAddOp = answer.colAddOp;
                    }
                })
                .catch(err => modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText'));
        },
        addOption: function(opId) {
            auth.nextAccess()
                .then(() =>
                    anal.addColOption({ id: this.id, opId: opId, type: this.type }))
                .then(answer => {
                    if (answer.success === false)
                        modal.show(this, answer.error, 'isShowModal', 'modalText');
                    else {
                        modal.show(this, 'Выполнено', 'isShowModal', 'modalText');
                        this.getInfo();
                    }
                })
                .catch(err => modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText'));
        },
        removeOption: function(opId) {
            auth.nextAccess()
                .then(() =>
                    anal.removeColOption({ id: this.id, opId: opId, type: this.type }))
                .then(answer => {
                    if (answer.success === false)
                        modal.show(this, answer.error, 'isShowModal', 'modalText');
                    else {
                        modal.show(this, 'Выполнено', 'isShowModal', 'modalText');
                        this.getInfo();
                    }
                })
                .catch(err => modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText'));
        }
    }
}