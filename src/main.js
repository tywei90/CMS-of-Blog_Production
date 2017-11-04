import Vue              from 'vue'
import VueResource      from 'vue-resource'
import VueValidator     from 'vue-validator'
import VueRouter        from 'vue-router'
import Vuex             from 'vuex'
    
import Waiting          from './components/Waiting.vue'
import Pop              from './components/Pop.vue'
import Article          from './components/Article.vue'
import Editor           from './components/Editor.vue'
import Console          from './components/Console.vue'
import ArticleList      from './components/ArticleList.vue'
import Archive          from './components/Archive.vue'
import Links            from './components/Links.vue'
import Account          from './components/Account.vue'
import NightSky         from './components/NightSky.vue'
import MyCanvas         from './components/MyCanvas.vue'

import store            from './vuex/store'
import {pop as popx}    from './vuex/actions'
import $                from './js/jquery.min'


Vue.use(VueResource)
Vue.use(VueValidator)
Vue.use(VueRouter)
Vue.use(Vuex)

let router = new VueRouter()

router.map({
    '/': {
        component: Archive
    },
    '/article': {
        component: Article
    },
    // 博客设置页面，需要拦截非博主登录
    '/console': {
        component: Console,
        subRoutes: {
            '/': {
                component: ArticleList
            },
            '/editor': {
                component: Editor
            },
            '/articleList': {
                component: ArticleList
            },
            '/menu': {
                component: Links
            },
            'account': {
                component: Account
            },
        },
    },
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
    // if (to.path === '/console') {
    //     abort()
    // } else {
    //     next()
    // }
})


router.start(App, 'body')