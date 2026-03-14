import Vue from "vue"
import Vuex from "vuex"
import user from "./user"
import claim from "./claim"
import revert from "./revert"
import admin from "./admin"
import general from "./general"

Vue.use(Vuex)

// 创建 vuex 实例
export default new Vuex.Store({
    modules: {
        user,
        claim,
        revert,
        admin,
        general
    }
})