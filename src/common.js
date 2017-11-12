import Vue              from 'vue'
import VueResource      from 'vue-resource'
import VueValidator     from 'vue-validator'
import VueRouter        from 'vue-router'
import Vuex             from 'vuex'
    
import Index            from './components/Index.vue'
import Login            from './components/Login.vue'
import Register         from './components/Register.vue'
import Waiting          from './components/Waiting.vue'
import Pop              from './components/Pop.vue'
import NightSky         from './components/NightSky.vue'
import MyCanvas         from './components/MyCanvas.vue'
    
import store            from './vuex/store'
import {pop as popx}    from './vuex/actions'

Vue.use(VueResource)
Vue.use(VueValidator)
Vue.use(VueRouter)
Vue.use(Vuex)

let router = new VueRouter()

router.map({
    '/': {
        component: Index
    },
    '/login': {
        component: Login
    },
    '/register': {
        component: Register
    }
})
let App = Vue.extend({
    data(){
        return {}
    },
    components: {Waiting,Pop,NightSky,MyCanvas},
    http: {
        root: '/'
    },
    computed: {
        waiting: ()=>store.state.waiting,
        pop:()=>store.state.popPara.pop,
        bg:()=>store.state.bg,
    },
    store,
    ready(){
        
    },
    vuex:{
        actions:{
            popx
        }
    }
})

// 路由跳转前调用的函数，这里为了解决页面有弹窗时，回退前进不消失的bug
router.beforeEach(function({to, abort, next}) {
    if(router.app.pop){
        router.app.popx()
    }
    next()
})

router.afterEach(function ({to, abort, next}) {
    console.log(router.app.bg);
    console.log(to);
    console.log(abort);
    if(router.app.bg === 'NightSky'){
        // 修改页面超过一屏底部白色的bug
        var h1 = $(document).height();
        var h2 = $(window).height();
        setTimeout(()=>{
            $('.nightSky').css('bottom', (h2 - h1)+'px');
        }, 0)
    }
    next()
});

router.start(App, 'body')