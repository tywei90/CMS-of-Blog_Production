<template>
    <section class="login">
        <validator name="loginValidator">
            <div class="form" @keyup.enter="loginRequest">
                <p>
                    <i v-link="{path: '/'}" class="icon iconfont icon-fire"></i>
                </p>
                <p>
                    <i class="icon iconfont icon-zhanghu"></i>
                    <input id="userName"
                           type="text"
                           name="userName"
                           placeholder="用户名"
                           v-model="userName">
                </p>
                <p>
                    <i class="icon iconfont icon-mima"></i>
                    <input id="password"
                           type="password"
                           placeholder="密码"
                           v-model="password">
                </p>
                <p>
                    <button @click="loginRequest">登陆</button>
                    <span>没有账号？去<a v-link="{path: '/register'}">注册</a></span>
                </p>
            </div>
        </validator>
    </section>
</template>
<script>
    import {toggle, bgToggle, pop}    from '../vuex/actions'
    import {get, set}           from '../js/cookieUtil'

    export default{
        data(){
            return {
                userName: '',
                password: '',
            }
        },
        created(){
            let userName = get('user')
            if (userName) {
                location.href='/' + userName + '#!/console'
            }
        },
        ready(){
            this.bgToggle('NightSky')
        },
        methods: {
            loginRequest(){
                this.userName = this.userName.trim()
                if(!this.userName){
                    this.pop('账号不能为空')
                    return
                }
                if(!this.password){
                    this.pop('密码不能为空')
                    return
                }
                this.toggle()
                this.$http.post('/web/login', {
                    userName: this.userName,
                    password: this.password
                }).then((response)=> {
                    this.loginResponse(response)
                }, (response)=> {
                    console.log(response)
                })
            },

            loginResponse(response, name = this.userName){
                this.toggle()
                let res = JSON.parse(response.body)
                let code = res.retcode
                let desc = res.retdesc
                let data = res.data
                switch (code){
                    case 200:
                        this.userName = name
                        let date = new Date(Date.now() + 60000 * 30)
                        let hostName = location.hostname
                        set('user', this.userName, date, '/', hostName)
                        // 判断是否有backUrl
                        var backUrl = this.$route.query.backUrl
                        if(backUrl){
                            location.href = backUrl
                        }else{
                            location.href='/' + this.userName + '#!/console'
                        }
                        break
                    default:
                        this.pop(desc)
                }
            }
        },
        vuex: {
            actions: {
                toggle,
                bgToggle,
                pop
            }
        }
    }
</script>
<style lang="sass">
    @import "../style/components/Login.scss";
</style>