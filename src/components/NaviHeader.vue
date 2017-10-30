<template>
    <header class="naviHeader">
        <button class="home"
                @click="toHome">
            <i class="icon iconfont icon-fire"></i>
        </button>
        <div class="user">
            <span>
                {{time}}好，{{userName}}
            </span>
            <button @click="logout">
                <span>登出</span>
                <i class="icon iconfont icon-signout"></i>
            </button>
        </div>
    </header>
</template>
<script>
    import {get, unset}      from '../js/cookieUtil'
    export default{
        data(){
            return {
                userName: ''
            }
        },
        created(){
            this.userName = get('user')
        },
        methods: {
            toHome() {
                location.href = '/#!/'
            },
            logout() {
                unset('user', '/', location.hostname)
                location.href = '/#!/login'
            }
        },
        computed: {
            time(){
                let hours = new Date().getHours()
                if (hours > 5 && hours < 12) {
                    return '早上'
                } else if (hours > 11 && hours < 19) {
                    return '下午'
                } else {
                    return '晚上'
                }
            }
        }
    }
</script>
<style lang="sass">
    @import "../style/components/NaviHeader.scss";
</style>