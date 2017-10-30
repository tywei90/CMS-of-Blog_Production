<template>
    <header class="myHeader">
        <div class="circle" @click="goHome">
            <img src="../img/me.jpg">
        </div>
        <ul class="menu">
            <li v-for="link in links">
                <!-- 已登录或者未登录但是访问链接不是博客设置页面 -->
                <!-- 新开窗口 -->
                <a v-if="(!!loginUserName || link.href.indexOf('/'+visitUserName+'#!/console')===-1) && link.newPage" :href="link.href" target="_blank">
                    {{link.name}}
                </a>
                <!-- 非新开窗口 -->
                <a v-if="(!!loginUserName || link.href.indexOf('/'+visitUserName+'#!/console')===-1) && !link.newPage" :href="link.href">
                    {{link.name}}
                </a>
                <!-- 未登录并且访问链接是博客设置页面 -->
                <a v-if="link.href.indexOf('/'+visitUserName+'#!/console')!==-1 && !loginUserName" @click="preIntercept(link.href, link.newPage)">
                    {{link.name}}
                </a>
            </li>
        </ul>
        <div class="userGiude f-fl" v-if="!loginUserName">
            <span class="login-no">您还未登录</span>
            <a @click="popLogin">登录</a>|
            <a href="/#!/register">注册</a>
        </div>
        <div class="userGiude f-fl" v-else>
            <span class="login-yes">您好，<em>{{loginUserName}}</em></span>
        </div>
    </header>
</template>
<script>
    import {get}        from '../js/cookieUtil'
    import popLogin     from '../js/login'
    import {pop}        from '../vuex/actions'

    export default{
        data(){
            return{
                links:null,
                visitUserName: '',
                loginUserName: ''
            }
        },
        created(){
            // 获取访问博客的用户名(地址栏上)
            var href = document.URL
            var indexEnd = href.lastIndexOf('#!')
            var indexStart = href.lastIndexOf('/', indexEnd) + 1
            this.visitUserName = href.slice(indexStart, indexEnd)

            this.loginUserName = get('user')
            let name = this.loginUserName || this.visitUserName || ''
            this.$http.post('/web/common/getLinks', {name: name})
            .then((response)=> {
                let res = JSON.parse(response.body)
                let code = res.retcode
                let desc = res.retdesc
                let data = res.data
                switch (code){
                    case 200:
                        this.links = data.links
                        break
                    default:
                        this.pop({
                            content: desc,
                            btn1: '返回',
                            cb1: ()=>{
                                window.history.back(-1); 
                            }
                        })
                }
            }, (response)=> {
                console.log(response)
            })
        },
        methods:{
            popLogin,
            goHome(){
                if(this.loginUserName){
                    // 登录的话直接去自己的主页
                    location.href = '/' + this.loginUserName + '#!/'
                }else{
                    // 否则还是在别人的主页
                    this.$router.go('/')
                }
            },
            // 主要是想拦截非登录状态进入博客设置页面
            preIntercept(linkUrl, newPage){
                this.popLogin(function(){
                    // 不能直接在登录成功之后新开窗口，这种没有用户操作的新开页面是不被允许的！
                    location.href = linkUrl
                })
            }
        },
        vuex:{
            actions:{
                pop
            }
        }
    }
</script>
<style lang="sass">
    @import "../style/components/MyHeader.scss";
</style>