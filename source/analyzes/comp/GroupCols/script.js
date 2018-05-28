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
            commInd: 3,
            isShowModal: false,
            btnText: 'Ок',
            modalTitle: '',
            modalText: '',
            newAnalResult: '',
            newAnkAnswer: '',
            newAnalName: '',
            newQuestion: '',
            questionType: 'choose'
        };
    },
    created: function() {
        console.log('GroupCols created');
    },
    components: {
        'ModalBox': ModalBox
    },
    computed: {
        colsData: function() {
            let data = this.$store.state.colsData;
            return data ? data : null;
        },
        analResults: function() {
            let data = this.colsData;
            return data ? data.analResults : null;
        },
        ankAnswers: function() {
            let data = this.colsData;
            return data ? data.ankAnswers : null;
        },
        analyzes: function() {
            let data = this.colsData;
            return data ? data.analyzes : null;
        },
        anketa: function() {
            let data = this.colsData;
            return data ? data.anketa : null;
        },
    },
    methods: {
        modalClose: function() {
            modal.hide(this, 'isShowModal', 'modalText');
        },
        addAnalyze: function() {
            if (check.notEmpty(this.newAnalName)) {
                auth.nextAccess()
                    .then(() => anal.addColumn({ name: this.newAnalName, type: 'analyze' }))
                    .then(answer => {
                        if (answer.success === false)
                            modal.show(this, answer.error, 'isShowModal', 'modalText');
                        else this.$emit('changeData', this.commInd);
                    })
                    .catch(err => modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText'));
            } else modal.show(this, 'введите название', 'isShowModal', 'modalText');
        },
        removeAnalyze: function(analId) {
            auth.nextAccess()
                .then(() => anal.removeColumn({ id: analId, type: 'analyze' }))
                .then(answer => {
                    if (answer.success === false)
                        modal.show(this, answer.error, 'isShowModal', 'modalText');
                    else this.$emit('changeData', this.commInd);
                })
                .catch(err => modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText'));
        },
        addAnketa: function() {
            console.log(this.questionType);
            if (check.notEmpty(this.newQuestion) && check.notEmpty(this.questionType)) {
                auth.nextAccess()
                    .then(() => anal.addColumn({ name: this.newQuestion, type: 'anketa', params: this.questionType }))
                    .then(answer => {
                        if (answer.success === false)
                            modal.show(this, answer.error, 'isShowModal', 'modalText');
                        else this.$emit('changeData', this.commInd);
                    })
                    .catch(err => modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText'));
            } else modal.show(this, 'введите название', 'isShowModal', 'modalText');
        },
        removeAnketa: function(ankId) {
            auth.nextAccess()
                .then(() => anal.removeColumn({ id: ankId, type: 'anketa' }))
                .then(answer => {
                    if (answer.success === false)
                        modal.show(this, answer.error, 'isShowModal', 'modalText');
                    else this.$emit('changeData', this.commInd);
                })
                .catch(err => modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText'));
        },
        addResult: function() {
            if (check.notEmpty(this.newAnalResult)) {
                auth.nextAccess()
                    .then(() =>
                        anal.addOption({ name: this.newAnalResult, type: 'analyze' }))
                    .then(answer => {
                        if (answer.success === false)
                            modal.show(this, answer.error, 'isShowModal', 'modalText');
                        else this.$emit('changeData', this.commInd);
                    })
                    .catch(err => modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText'));
            } else modal.show(this, 'введите название', 'isShowModal', 'modalText');
        },
        removeResult: function(resId) {
            auth.nextAccess()
                .then(() =>
                    anal.removeOption({ id: resId, type: 'analyze' }))
                .then(answer => {
                    if (answer.success === false)
                        modal.show(this, answer.error, 'isShowModal', 'modalText');
                    else this.$emit('changeData', this.commInd);
                })
                .catch(err => modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText'));
        },
        addAnswer: function() {
            if (check.notEmpty(this.newAnkAnswer)) {
                auth.nextAccess()
                    .then(() =>
                        anal.addOption({ name: this.newAnkAnswer, type: 'anketa' }))
                    .then(answer => {
                        if (answer.success === false)
                            modal.show(this, answer.error, 'isShowModal', 'modalText');
                        else this.$emit('changeData', this.commInd);
                    })
                    .catch(err => modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText'));
            } else modal.show(this, 'введите название', 'isShowModal', 'modalText');
        },
        removeAnswer: function(ansId) {
            auth.nextAccess()
                .then(() =>
                    anal.removeOption({ id: ansId, type: 'anketa' }))
                .then(answer => {
                    if (answer.success === false)
                        modal.show(this, answer.error, 'isShowModal', 'modalText');
                    else this.$emit('changeData', this.commInd);
                })
                .catch(err => modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText'));
        }
    }
}