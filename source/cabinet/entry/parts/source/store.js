module.exports = {
    state: {
        cabinetInfo: {
            userName: null,
            roleName: null,
            photoPath: null,
            defaultPhotoPath: "img/profile.jpg",
            photoUrl: null
        },
        anketaInfo: {
            firstName: null,
            secondName: null,
            phone: null,
            city: null,
            workPlace: null,
            aboutYourself: null
        },
        settingsInfo: {
            email: null
        },
        adminInfo: {},
        default: {
            rowCount: 5
        }
    },
    mutations: {
        setCabinetInfo: (state, value) => { state.cabinetInfo = value },
        setAnketaInfo: (state, value) => { state.anketaInfo = value },
        setSettingsInfo: (state, value) => { state.settingsInfo = value },
        setAdminInfo: (state, value) => { state.adminInfo = value }
    }
}