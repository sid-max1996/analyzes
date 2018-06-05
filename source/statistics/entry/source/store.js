module.exports = {
    state: {
        curSel: null,
        selectionsData: {},
        addSelectionInfo: {},
        addRecordsInfo: {},
        statisticsInfo: {},
        default: {
            rowCount: 5
        }
    },
    mutations: {
        setCurSelection: (state, value) => { state.curSel = value },
        setSelectionsData: (state, value) => { state.selectionsData = value },
        setAddSelectionInfo: (state, value) => { state.addSelectionInfo = value },
        setAddRecordsInfo: (state, value) => { state.addRecordsInfo = value },
        setStatisticsInfo: (state, value) => { state.statisticsInfo = value }
    }
}