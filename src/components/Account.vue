<template>
    <section class="account">
        <validator name="loginValidator">
            <div class="title">修改密码</div>
            <div class="password">
                <i class="icon iconfont icon-mima"></i>
                <input type="password"
                       placeholder="输入原密码"
                       initial="off"
                       detect-change="off"
                       detect-blur="off"
                       v-validate:password1="passwordRule"
                       v-model="opw">
                <br>
                <i class="icon iconfont icon-mima"></i>
                <input type="password"
                       placeholder="输入新密码"
                       initial="off"
                       detect-change="off"
                       detect-blur="off"
                       v-validate:password2="passwordRule"
                       v-model="pw">
                <br>
                <i class="icon iconfont icon-mima"></i>
                <input type="password"
                       placeholder="确认新密码"
                       initial="off"
                       detect-change="off"
                       detect-blur="off"
                       v-validate:password3="passwordRule"
                       @keydown.enter="savePw"
                       v-model="rpw">
            </div>
            <div class="panel panel1">
                <button @click="savePw">保存</button>
            </div>
            <div class="panel panel2">
                <button @click="preDeleteUser">注销</button>
            </div>
        </validator>
    </section>
</template>
<script>
    import {pop}            from '../vuex/actions'
    import {get, unset}          from '../js/cookieUtil'
    import popLogin         from '../js/login'

    export default{
        data(){
            return {
                opw: '',
                pw: '',
                rpw: '',
                passwordRule: {
                    minlength: 4,
                    maxlength: 16
                }
            }
        },
        methods: {
            popLogin,
            savePw(){
                this.$validate(true, ()=> {
                    if(!this.opw){
                        this.pop('原密码不能为空')
                        return
                    }
                    if(!this.pw){
                        this.pop('新密码不能为空')
                        return
                    }
                    if(!this.rpw){
                        this.pop('请确认新密码')
                        return
                    }
                    if (!this.$loginValidator.valid) {
                        this.pop('密码格式错误')
                        return
                    }
                    if (this.pw !== this.rpw) {
                        this.pop('两次输入不一致')
                        return
                    }
                    this.$http.post('/web/savePw', {
                        oldPassword: this.opw,
                        newPassword: this.pw
                    }).then((res)=> {
                        let data = JSON.parse(res.body);
                        switch (data.retcode){
                            case 200:
                                this.pop({
                                    showClose: false,
                                    content: data.retdesc,
                                    btn1: '重新登录',
                                    cb1: function () {
                                        unset('user', '/', location.hostname)
                                        location.href = "/#!/login"
                                    },
                                })
                                break
                            case 410:
                                this.popLogin(this.savePw)
                                break
                            case 430:
                                this.pop({
                                    showClose: false,
                                    content: desc,
                                    btn1: '确定',
                                    cb1: ()=>{
                                        location.href = data.name + '#!/console'
                                    }
                                })
                                break
                            default:
                                this.pop({
                                    content: data.retdesc,
                                })
                        }
                    }, (res)=> {
                        console.log(res)
                    })
                })
            },
            preDeleteUser(){
                var name = get('user')
                if(!name){
                    this.popLogin(this.deleteUser)
                    return
                }
                this.pop({
                    content: '您确定要注销' + name + '账户吗？',
                    btn1: '确定|danger',
                    cb1: ()=>{
                        this.deleteUser()
                    },
                    btn2: '取消'
                })
            },
            deleteUser(){
                this.$http.post('/web/deleteUser')
                .then((response)=> {
                        let res = JSON.parse(response.body)
                        let code = res.retcode
                        let desc = res.retdesc
                        let data = res.data
                        switch (code){
                            case 200:
                                // 清除cookie
                                unset('user', '/', location.hostname)
                                this.pop({
                                    showClose: false,
                                    content: desc,
                                    btn1: '再去首页看看',
                                    cb1:function () {
                                        location.href = '/#!/'
                                    }
                                })
                                break
                            case 410:
                                this.popLogin(this.deleteUser)
                                break
                            case 430:
                                this.pop({
                                    showClose: false,
                                    content: desc,
                                    btn1: '确定',
                                    cb1: ()=>{
                                        location.href = data.name + '#!/console'
                                    }
                                })
                                break
                            default:
                                this.pop(desc)
                    }
                }, (response)=> {
                    console.log(response)
                })
            }
        },
        vuex: {
            actions: {
                pop
            }
        }
    }
</script>
<style lang="sass">
    @import "../style/components/Account.scss";
</style>