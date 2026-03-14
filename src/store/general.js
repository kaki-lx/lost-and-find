const general = {
    state: null != window.sessionStorage.getItem('general') ? JSON.parse(window.sessionStorage.getItem('general')) : {
        type:[
            { id: 1, label: "钥匙", value: "钥匙" },
            { id: 2, label: "宠物", value: "宠物" },
            { id: 3, label: "证件", value: "证件" },
            { id: 4, label: "数码", value: "数码" },
            { id: 5, label: "美妆", value: "美妆" },
            { id: 6, label: "衣服", value: "衣服" },
            { id: 7, label: "首饰", value: "首饰" },
            { id: 8, label: "电器", value: "电器" },
            { id: 9, label: "包包", value: "包包" },
            { id: 10, label: "快递", value: "快递" },
            { id: 11, label: "书籍", value: "书籍" },
            { id: 12, label: "其他", value: "其他" },
        ],
    },

    getters: {
        getType(state) {
            return state.type
        }
    },

    mutations: {
        
    },

    actions: {

    }
}


export default general