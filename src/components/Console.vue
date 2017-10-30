<template>
    <navi-header></navi-header>
    <aside class="console">
        <div class="circle" @click="$router.go('/')">
            <img src="../img/me.jpg" alt="me">
        </div>
        <menu class="navigation">
            <ul>
                <li @click="$router.go('/')">
                    <i class="icon iconfont icon-zhuye"></i>
                    <span>主页</span>
                </li>
                <li @click="$router.go('/console/articleList')">
                    <i class="icon iconfont icon-wenzhang"></i>
                    <span>文章</span>
                </li>
                <li @click="$router.go('/console/menu')">
                    <i class="icon iconfont icon-lianjie"></i>
                    <span>链接</span>
                </li>
                <li @click="$router.go('/console/account')">
                    <i class="icon iconfont icon-zhanghu"></i>
                    <span>账户</span>
                </li>
            </ul>
        </menu>
    </aside>
    <router-view></router-view>
</template>
<script>
    import NaviHeader           from './NaviHeader.vue'
    import {pop, bgToggle}      from '../vuex/actions'
    import {get, set, unset}    from '../js/cookieUtil'

    export default{
        created(){
            let loginUserName = get('user')
            // 获取访问博客的用户名(地址栏上)
            var href = document.URL
            var indexEnd = href.lastIndexOf('#!')
            var indexStart = href.lastIndexOf('/', indexEnd) + 1
            let visitUserName = href.slice(indexStart, indexEnd)
            // 登录状态进入页面，重新计时cookie失效时间
            if (loginUserName) {
                let date = new Date(Date.now() + 60000 * 30)
                let hostName = location.hostname
                set('user', loginUserName, date, '/', hostName)
            }
            if (loginUserName && loginUserName!==visitUserName) {
                // 改成前端跳转地址，弹窗会有bug, 因为显示的是登录账号相关内容
                location.href = '/' + loginUserName + '#!/console'
            }
        },
        components: {
            NaviHeader,
        },
        ready(){
            this.bgToggle('NightSky')
        },
        vuex: {
            actions: {
                pop,
                bgToggle
            }
        }
    }
</script>
<style lang="sass">
    @import "../style/components/Console.scss";
</style>