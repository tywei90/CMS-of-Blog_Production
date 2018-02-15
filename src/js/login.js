//  这是登录弹窗脚本，需要在页面注入pop的action, 并将此module作为vue的methods
//  样式在common.scss里
//  传入的cb参数是登录成功的回调
import $         from '../js/jquery.min'
import {set}     from '../js/cookieUtil'

function popLogin(cb) {
    this.pop({
        css: 'login-dialog',
        title: '',
        content: [
            '<ul class="login-form">',
            '<li class="fire-logo">',
            '<i class="icon iconfont icon-fire"></i>',
            '</li>',
            '<li class="username">',
            '<i class="icon iconfont icon-zhanghu"></i>',
            '<input type="text" name="userName" placeholder="去除chrome自动完成" autocomplete="off" style="display:none">',
            '<input class="username-input" type="text" name="userName" placeholder="用户名" autocomplete="off">',
            '<i class="icon iconfont icon-cuowu f-hide2"></i>',
            '</li>',
            '<li class="password">',
            '<i class="icon iconfont icon-mima"></i>',
            '<input type="password" placeholder="去除chrome自动完成" autocomplete="off" style="display:none">',
            '<input class="password-input" type="password" placeholder="密码" autocomplete="off">',
            '<i class="icon iconfont icon-cuowu f-hide2"></i>',
            '</li>',
            '<li class="errorTip f-hide2">',
            '<i class="icon iconfont icon-weixian"></i>',
            '<span></span>',
            '</li>',
            '<li class="loginBtn">',
            '<p class="btn disabled btn-primary">',
            '<span>登录</span>',
            '</p>',
            '</li>',
            '<li class="others f-cb">',
            '<span class="f-fl">忘记密码？</span>',
            '<em class="f-fr">去注册</em>',
            '</li>',
            '</ul>'
        ].join(''),
        init: () => {
            var me = this
            var ca = {}
            var Core = {
                init() {
                    if(screen.width < 700){
                        location.href = '/#!/login' + '?backUrl=' + encodeURIComponent(document.URL);
                        me.pop();
                    }else{
                        ca.$dialog = $('.login-dialog')
                        ca.$inputs = $('.username-input, .password-input', ca.$dialog)
                        ca.$input1 = $('.username-input', ca.$dialog)
                        ca.$input2 = $('.password-input', ca.$dialog)
                        ca.$clears = $('.icon-cuowu', ca.$dialog)
                        ca.$forget = $('.others span', ca.$dialog)
                        ca.$register = $('.others em', ca.$dialog)
                        ca.$errorTip = $('.errorTip', ca.$dialog)
                        ca.$errorTipText = $('.errorTip span', ca.$dialog)
                        ca.$btn = $('.loginBtn .btn', ca.$dialog)
                        this.initEvent()
                    }
                },
                initEvent() {
                    ca.$inputs.on('focus keydown keyup', function(event) {
                        if ($(this).hasClass('blankInput')) {
                            $(this).removeClass('blankInput')
                            ca.$errorTip.addClass('f-hide2')
                        }
                        if (!$(this).val()) {
                            $(this).next().addClass('f-hide2')
                        } else {
                            $(this).next().removeClass('f-hide2')
                        }
                        var allFilled = true
                        $.each(ca.$inputs, function(index, el) {
                            if (!$(el).val()) {
                                allFilled = false
                            }
                        })
                        if (allFilled) {
                            ca.$btn.removeClass('disabled')
                            if (!ca.$errorTip.hasClass('f-hide2')) {
                                ca.$errorTip.addClass('f-hide2')
                            }
                        } else {
                            ca.$btn.addClass('disabled')
                        }
                    })
                    ca.$btn.on('click', (event) => {
                            this.validate()
                        })
                        // 支持回车提交
                    ca.$inputs.on('keyup', (event) => {
                        if (event.keyCode === 13) {
                            $(event.target).blur()
                            this.validate()
                        }
                    })
                    ca.$clears.on('click', function(event) {
                        $(this).prev().val('')
                        $(this).prev().focus()
                    })
                    ca.$forget.on('click', function() {
                        me.pop();
                        setTimeout(function(){
                            me.pop('暂未开发')
                        }, 200);
                    })
                    ca.$register.on('click', function() {
                        me.pop()
                        location.href = '/#!/register'
                    })
                },
                loginRequest() {
                    // toggle会造成页面闪烁, 暂时去掉，后面优化
                    // me.toggle()
                    me.$http.post('/web/login', {
                        userName: ca.$input1.val().trim(),
                        password: ca.$input2.val()
                    }).then((response) => {
                        this.loginResponse(response, ca.$input1.val().trim())
                    }, (response) => {
                        console.log(response)
                    })
                },
                loginResponse(response, name) {
                    // me.toggle()
                    let res = JSON.parse(response.body)
                    let code = res.retcode
                    let desc = res.retdesc
                    let data = res.data
                    switch (code) {
                        case 200:
                            let date = new Date(Date.now() + 60000 * 30)
                            let hostName = location.hostname
                            set('username', name, date, '/', hostName)
                            me.pop()
                            // 如果有传回调函数，则执行回调
                            if(typeof cb === 'function'){
                                cb()
                            }else{
                                location.reload()
                            }
                            break
                        default:
                            ca.$errorTipText.text('账号或密码错误')
                            ca.$errorTip.removeClass('f-hide2')
                            break
                    }
                },
                validate() {
                    // 复位错误提示
                    if (ca.$input2.hasClass('blankInput')) {
                        ca.$input2.removeClass('blankInput')
                    }
                    if (!ca.$errorTip.hasClass('f-hide2')) {
                        ca.$errorTip.addClass('f-hide2')
                    }
                    // 判空逻辑
                    if (!ca.$input1.val()) {
                        ca.$input1.addClass('blankInput')
                        ca.$errorTipText.text('请输入账号')
                        ca.$errorTip.removeClass('f-hide2')
                        return
                    }
                    if (!ca.$input2.val()) {
                        ca.$input2.addClass('blankInput')
                        ca.$errorTipText.text('请输入密码')
                        ca.$errorTip.removeClass('f-hide2')
                        return
                    }
                    if (ca.$btn.hasClass('disabled')) {
                        return
                    }
                    this.loginRequest()
                }
            }
            Core.init()
        }
    })
}
export default popLogin