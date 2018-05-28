module.exports = {
    state: {
        curGroup: null,
        groupsData: {},
        groupInfo: {},
        analyzesData: {},
        addGroupData: {},
        colsData: {},
        groupSettings: {},
        default: {
            rowCount: 5
        }
    },
    mutations: {
        setCurGroup: (state, value) => { state.curGroup = value },
        setGroupsData: (state, value) => { state.groupsData = value },
        setAnalyzesData: (state, value) => { state.analyzesData = value },
        setAddGroupData: (state, value) => { state.addGroupData = value },
        setAddGroupCollData: (state, value) => {
            state.addGroupData.colCount = value.colCount;
            state.addGroupData.collectors = value.collectors;
        },
        setAddGroupManData: (state, value) => {
            state.addGroupData.manCount = value.manCount;
            state.addGroupData.managers = value.managers;
        },
        setAddGroupAnalData: (state, value) => {
            state.addGroupData.analCount = value.analCount;
            state.addGroupData.analyzes = value.analyzes;
        },
        setAddGroupAnkData: (state, value) => {
            state.addGroupData.ankCount = value.ankCount;
            state.addGroupData.anketa = value.anketa;
        },
        setColsData: (state, value) => { state.colsData = value },
        setGroupSettings: (state, value) => { state.groupSettings = value },
        setGroupInfo: (state, value) => { state.groupInfo = value }
    }
}