<template>
    <div class="wrap">
        <header class="myHeader f-cb">
            <div class="circle f-fl">
                <i class="icon iconfont icon-fire"></i>
            </div>
            <div class="naviHead f-fl" v-if="!userName">
                <span class="login-no">您还未登录</span>
                <a @click="popLogin">登录</a>
                <a href="/#!/register">注册</a>
            </div>
            <div class="naviHead f-fl" v-else>
                <span class="login-yes">您好，{{userName}}</span>
                <a :href="myHome">主页</a>
                <a :href="mySetting">设置</a>
            </div>
        </header>
        <section class="index">
            <div class="latestArticles">
                <p>最新发布的文章：</p>
                <div v-if="!articles.length && ajaxReady1">目前还没有最新发布的文章，赶紧抢沙发=&gt;<a href="/#!/register">去注册</a></div>
                <ul class="f-cb" v-else>
                    <li v-for="item in articles">
                        <a :href="item.href">{{$index+1}}. {{item.title}}</a>
                    </li>
                </ul>
            </div>
            <div class="registedUsers">
                <p>目前已注册的用户：</p>
                <div v-if="!users.length && ajaxReady2">目前还没有注册的用户，赶紧抢沙发=&gt;<a href="/#!/register">去注册</a></div>
                <ul class="f-cb" v-else>
                    <li 
                        :style="{'background': 'rgba(' + Math.floor(Math.random()*256) + ',' + Math.floor(Math.random()*256) + ',' + Math.floor(Math.random()*256) + ',' + 0.6 + ')'}" 
                        class="f-fl" 
                        v-for="user in users">
                        <a :href="user.href">{{user.name}}</a>
                    </li>
                </ul>
            </div>
        </section>
        <my-footer></my-footer>
    </div>
</template>
<script>
    import myHeader                     from './MyHeader.vue'
    import myFooter                     from './MyFooter.vue'
    import {pop, bgToggle, toggle}      from '../vuex/actions'
    import {get, set}                   from '../js/cookieUtil'
    import popLogin                     from '../js/login'

    export default{
        data(){
            return {
                userName: '',
                articles: [],
                ajaxReady1: false,
                users: [],
                ajaxReady2: false
            }
        },
        computed:{
            myHome(){
                return '/' + this.userName + '#!/'
            },
            mySetting(){
                return '/' + this.userName + '#!/console'
            }
        },
        created(){
            // 登录状态进入页面，重新计时cookie失效时间
            this.userName = get('username')
            if (this.userName) {
                let date = new Date(Date.now() + 60000 * 30)
                let hostName = location.hostname
                set('username', this.userName, date, '/', hostName)
            }
            // 请求最新的五篇文章
            this.$http.get('/web/latestArticles')
            .then((response)=> {
                let res = JSON.parse(response.body)
                let code = res.retcode
                let desc = res.retdesc
                let data = res.data
                switch (code){
                    case 200:
                        this.ajaxReady1 = true
                        this.articles = data.articles || []
                        break
                    default:
                        this.pop(desc)
                }
            }, (response)=> {
                console.log(response)
            })
            // 请求所有已注册的用户
            this.$http.get('/web/registedUsers')
            .then((response)=> {
                let res = JSON.parse(response.body)
                let code = res.retcode
                let desc = res.retdesc
                let data = res.data
                switch (code){
                    case 200:
                        this.ajaxReady2 = true
                        this.users = data.users || []
                        this.users.forEach(function(item){
                            item.href = '/' + item.name + '#!/'
                        })
                        break
                    default:
                        this.pop(desc)
                }
            }, (response)=> {
                console.log(response)
            })
        },
        ready(){
            this.bgToggle('')
        },
        methods: {
            popLogin,
        },
        components: {
            myHeader,
            myFooter,
        },
        vuex:{
            actions:{
                bgToggle,
                pop,
                toggle
            }
        }
    }
</script>
<style lang="sass">
    @import "../style/common.scss";
    @import "../style/components/Index.scss";
</style>