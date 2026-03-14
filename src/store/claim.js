const claim = {
    // data 数据
    state: null != window.sessionStorage.getItem('claim') ? JSON.parse(window.sessionStorage.getItem('claim')) : {
        claimList: {},        
    },

    // 唯一取值的方法 计算属性
    getters: {
        getClaimList(state) {
            return state.claimList
        }
    },

    // 唯一可以修改 state 值的方法，同步阻塞
    mutations: {
        updateClaimList(state, claimList) {
            state.claimList = claimList
        }
    },

    // 异步调用 mutations 的方法
    actions: {
        asyncUpdateClaimList(context, claimList) {
            context.commit('updateClaimList', claimList)
        }
    }
}

export default claim