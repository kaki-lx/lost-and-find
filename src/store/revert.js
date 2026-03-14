const revert = {
    // data 数据
    state: null != window.sessionStorage.getItem('revert') ? JSON.parse(window.sessionStorage.getItem('return')) : {
        revertList: {},        
    },

    // 唯一取值的方法 计算属性
    getters: {
        getRevertList(state) {
            return state.revertList
        }
    },

    // 唯一可以修改 state 值的方法，同步阻塞
    mutations: {
        updateRevertList(state, revertList) {
            state.revertList = revertList
        }
    },

    // 异步调用 mutations 的方法
    actions: {
        asyncUpdateRevertList(context, revertList) {
            context.commit('updateRevertList', revertList)
        }
    }
}

export default revert