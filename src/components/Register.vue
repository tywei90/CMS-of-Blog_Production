<!-- vue的validate工具不适合用来处理复杂的验证逻辑，
    因为他的验证时机会受到所处验证区域其他vue参数更新的影响；
    对于复杂的验证还是采用原始方法，根据不同case设置tip
 -->

<template>
    <section class="register">
        <validator name="loginValidator">
            <div class="form" @keyup.enter="registerRequest">
                <div class="part">
                    <i v-link="{path: '/'}" class="icon iconfont icon-fire"></i>
                </div>
                <div class="part f-cb">
                    <div class="f-fr">
                        <input id="userName"
                            type="text"
                            name="userName"
                            placeholder="请输入您的账号"
                            v-model="userName"
                            initial="off"
                            detect-change="off"
                            detect-blur="on"
                            @blur="userBlur=true"
                            @focus="userBlur=false"
                            @valid="onUsernameValid"
                            v-validate:user-name="['userRule']">
                        <label for="userName" v-if="userBlur && $loginValidator.userName.userRule && userName">
                            <i class="icon iconfont icon-cuowu"></i>
                            <span>4~16个字符，支持小写英文数字和下划线，请以英文字母开头</span>
                        </label>
                        <label for="userName" v-if="userBlur && !$loginValidator.userName.userRule  && userName">
                            <i v-if="hasSameUsername" class="icon iconfont icon-weixian"></i>
                            <i v-else class="icon iconfont icon-dui"></i>
                            <span v-if="hasSameUsername">已存在同名账号，请更换其他账号</span>
                            <span class="username-suc" v-else>恭喜，该账号可以注册！</span>
                        </label>
                    </div>
                    <span class="f-fr">用户名：</span>
                </div>
                <div class="part f-cb">
                    <div class="f-fr">
                        <input id="email"
                            type="email"
                            name="email"
                            placeholder="请输入您的邮箱"
                            v-model="email"
                            @blur="emailBlur=true"
                            @focus="emailBlur=false"
                            initial="off"
                            detect-change="off"
                            detect-blur="on"
                            v-validate:email="['mailRule']">
                        <label for="email" v-if="emailBlur && $loginValidator.email.mailRule && email">
                            <i class="icon iconfont icon-cuowu"></i>
                            <span>邮箱格式错误</span>
                        </label>
                    </div>
                    <span class="f-fr">邮箱：</span>
                </div>
                <div class="part f-cb send-email">
                    <span class="f-fl">验证码：</span>
                    <div class="f-fl">
                        <input id="emailCode"
                            type="text"
                            name="emailCode"
                            placeholder="请输入您邮箱收到的验证码"
                            v-model="emailCode" >
                    </div>
                    <div @click="handleSendEmail" class="f-fl sendEmailBtn" :class="[!canSendEmail? 'disabled': '']">
                        <span v-if="canSendEmail">发送验证码</span>
                        <span v-if="!canSendEmail">{{countDown}}s后可再次发送</span>
                    </div>
                </div>
                <!-- <div class="part f-cb">
                    <div class="f-fr">
                        <input id="phoneNum"
                            type="text"
                            name="phoneNum"
                            placeholder="请输入您的手机号码"
                            v-model="phoneNum"
                            @blur="phoneBlur=true"
                            @focus="phoneBlur=false"
                            initial="off"
                            detect-change="off"
                            detect-blur="on"
                            v-validate:phone-num="['phoneRule']">
                        <label for="phoneNum" v-if="phoneBlur && $loginValidator.phoneNum.phoneRule">
                            <i class="icon iconfont icon-cuowu"></i>
                            <span>手机号码格式不正确</span>
                        </label>
                    </div>
                    <span class="f-fr">手机号：</span>
                </div> -->
                <div class="part f-cb">
                    <div class="password-level f-cb" :class="levelPointer1" v-if="passwordLevel1 > 0">
                        <span class="f-fl"></span>
                        <span class="f-fl"></span>
                        <span class="f-fl"></span>
                    </div>
                    <div class="f-fr">
                        <input id="password1"
                            type="password"
                            placeholder="密码长度4-16个字符"
                            v-model="password1"
                            @input="showPasswordLevel(1, password1)">
                        <label for="password1" v-if="password1!==''">
                            <i v-if="passwordLevel1 === 0" class="icon iconfont icon-cuowu"></i>
                            <span v-if="passwordLevel1 === 0">{{passwordTip1}}</span>
                            <span v-else class="level-tip">{{passwordTip1}}</span>
                        </label>
                    </div>
                    <span class="f-fr">设置密码：</span>
                </div>
                <div class="part f-cb">
                    <div class="f-fr">
                        <input id="password2"
                            type="password"
                            placeholder="密码长度4-16个字符"
                            v-model="password2"
                            @blur="validatePassword2">
                        <label for="password2" v-if="password2!=='' && passwordTip2!==''">
                            <i class="icon iconfont icon-cuowu"></i>
                            <span>{{passwordTip2}}</span>
                        </label>
                    </div>
                    <span class="f-fr">确认密码：</span>
                </div>
                <div class="part">
                    <button @click="registerRequest">注册</button>
                    <span>如果您已有帐号，可在此<a v-link="{path: '/login'}">登录</a></span>
                </div>
            </div>
        </validator>
    </section>
</template>
<script>
    import {toggle, bgToggle, pop}        from '../vuex/actions'
    import {get, set}                         from '../js/cookieUtil'
    import {userRule, phoneRule, getPasswordLevel, mailRule}      from '../js/validate'
    export default{
        data(){
            return {
                userName: '',
                userBlur: false,
                email: '',
                emailBlur: false,
                emailCode: '',
                emailCodeBlur: false,
                canSendEmail: true,
                countDown: 60,
                // phoneNum: '',
                // phoneBlur: false,
                password1: '',
                passwordTip1: '',
                passwordLevel1: '',
                levelPointer1: '',
                password2: '',
                passwordTip2: '',
                passwordState: false,
                hasSameUsername: false,
                emailCodeValid: false
            }
        },
        validators: {
            userRule,
            phoneRule,
            mailRule
        },
        created(){
            let userName = get('user')
            if (userName) {
                location.href='/' + userName + '#!/'
            }
        },
        ready(){
            this.bgToggle('NightSky')
        },
        methods: {
            handleSendEmail(){
                if(!this.canSendEmail){
                    return
                }
                if(!this.email){
                    this.pop('请先输入邮箱！')
                    return
                }
                if(this.$loginValidator.email.mailRule){
                    this.pop('邮箱格式错误！')
                    return
                }
                this.$http.post('/web/genEmailCode', {
                    email: this.email
                }).then((response)=> {
                    let res = JSON.parse(response.body)
                    let code = res.retcode
                    let desc = res.retdesc
                    switch (code){
                        case 200:
                            this.canSendEmail = false;
                            var timer = setInterval(()=>{
                                if(this.countDown <= 0){
                                    this.canSendEmail = true
                                    this.countDown = 60
                                    window.clearInterval(timer)
                                    return
                                }
                                this.countDown = this.countDown - 1
                            }, 1000)
                            break
                        default:
                            this.pop(desc)
                    }
                }, (response)=> {
                    console.log(response)
                })
            },
            validatePassword2(){
                if(this.password2.length < 4){
                    this.passwordTip2 = '密码太短'
                    this.passwordState = false
                    return
                }
                if(this.password2.length > 16){
                    this.passwordTip2 = '密码太长'
                    this.passwordState = false
                    return
                }
                if(this.password1 !== this.password2){
                    this.passwordTip2 = "两次密码输入不一致"
                    this.passwordState = false
                    return
                }
                this.passwordTip2 = ""
                this.passwordState = true
            },
            showPasswordLevel(state, password){
                var level = getPasswordLevel(password)
                switch (level){
                    case 0:
                        this['passwordLevel'+state] = 0
                        if(password.length < 4){
                            this['passwordTip'+state] = '密码太短'
                        }else{
                            this['passwordTip'+state] = '密码太长'
                        }
                        break
                    case 1:
                        this['passwordLevel'+state] = 1
                        this['levelPointer'+state] = 'password-level1'
                        this['passwordTip'+state] = '密码强度：弱'
                        break
                    case 2:
                        this['passwordLevel'+state] = 2
                        this['levelPointer'+state] = 'password-level2'
                        this['passwordTip'+state] = '密码强度：中'
                        break
                    case 3:
                        this['passwordLevel'+state] = 3
                        this['levelPointer'+state] = 'password-level3'
                        this['passwordTip'+state] = '密码强度：强'
                        break

                }
            },
            onUsernameValid(){
                if(this.userName !== ''){
                    this.$http.post('/web/validateUsername', {
                        userName: this.userName
                    }).then((response)=> {
                        let res = JSON.parse(response.body)
                        let code = res.retcode
                        let desc = res.retdesc
                        switch (code){
                            case 200:
                                this.hasSameUsername = false
                                break
                            case 430:
                                this.hasSameUsername = true
                                break
                            default:
                                this.hasSameUsername = false
                        }
                    }, (response)=> {
                        console.log(response)
                    })
                }
            },
            registerRequest(){
                if(!this.userName){
                    this.pop('请输入用户名！')
                    return
                }
                if(!this.email){
                    this.pop('请输入邮箱！')
                    return
                }
                if(!this.emailCode){
                    this.pop('请输入验证码！')
                    return
                }
                if(!this.password1){
                    this.pop('请设置密码！')
                    return
                }
                if(!this.password2){
                    this.pop('请确认密码！')
                    return
                }
                if(!this.$loginValidator.valid || this.hasSameUsername || !this.passwordState){
                    this.pop('请确认信息！')
                    return
                }
                this.userName = this.userName.trim()
                this.toggle()
                this.$http.post('/web/register', {
                    userName: this.userName,
                    password: this.password2,
                    email: this.email,
                    emailCode: this.emailCode
                }).then((response)=> {
                    this.registerResponse(response)
                }, (response)=> {
                    console.log(response)
                })
            },
            registerResponse(response, name = this.userName){
                this.toggle()
                let res = JSON.parse(response.body)
                let code = res.retcode
                let desc = res.retdesc
                let data = res.data
                switch (code){
                    case 200:
                        let date = new Date(Date.now() + 60000 * 30)
                        let hostName = location.hostname
                        set('user', data.userName, date, '/', hostName)
                        this.pop({
                            css: 'regist-suc',
                            content: '<i class="icon iconfont icon-dui"></i>恭喜，注册成功！',
                            btn1: '去主页',
                            cb1: function () {
                                location.href='/' + this.userName + '#!/'
                            }.bind(this)
                        })
                        break
                    default: 
                        this.pop(desc)
                }
            },
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
    @import "../style/components/Register.scss";
</style>