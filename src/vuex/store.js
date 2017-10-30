import Vue  from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    waiting: false,
    popPara: {
        pop: false
    },
    bg:''
}
const mutations = {

    TOGGLE: (state)=>state.waiting = !state.waiting,
    POP: (state, para)=>state.popPara = para,
    BGTOGGLE: (state,bg)=>state.bg=bg

}
export default new Vuex.Store({
    state,
    mutations
})