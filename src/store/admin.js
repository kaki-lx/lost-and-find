const admin = {
    state: null != window.sessionStorage.getItem('admin') ? JSON.parse(window.sessionStorage.getItem('admin')) : {
        loginDate: '',
        page: '',
    },

    getters: {
        getLoginDate(state) {
            return state.loginDate
        },
        getPage(state) {
            return state.page
        },
    },

    mutations: {
        updateLoginDate(state, loginDate) {
            state.loginDate = loginDate
        },
        updatePage(state, page) {
            state.page = page
        },
    },

    actions: {
        asyncUpdateLoginDate(context, loginDate) {
            context.commit('updateLoginDate', loginDate)
        },
        asyncUpdatePage(context, page) {
            context.commit('updatePage', page)
        },
    }
}


export default admin