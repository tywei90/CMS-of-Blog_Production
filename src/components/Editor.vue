<template>
    <section class="editor">
        <input class="title"
               placeholder="标题"
               v-model="title">
        <div :class="view">
            <textarea v-model="input">
            </textarea>
            <button class="toggle"
                    @click="editToggle">
                <i class="icon iconfont icon-jiantou-left"
                   v-show="view==='edit'">
                </i>
                <i class="icon iconfont icon-jiantou-right"
                   v-show="view==='inspect'">
                </i>
            </button>
            <article v-html="input | marked">
            </article>
        </div>
        <div class="panel">
            <input type="text"
                   v-model="dateStr"
            >
            <button class="save"
                    @click="send">保存
            </button>
        </div>
    </section>
</template>
<script>
    import popLogin     from '../js/login'
    import marked       from '../js/marked.min'
    import hljs         from '../js/highlight.min'
    import {pop}        from '../vuex/actions'

    export default{
        data(){
            return {
                title: '',
                input: '',
                date: '',
                id: '',
                view: 'edit'
            }
        },
        filters: {
            marked
        },
        watch:{
            input:function () {
                hljs.initHighlighting()
                hljs.initHighlighting.called = false
            }
        },
        created(){
            if (this.$route.query.id) {
                let id = this.$route.query.id
                this.$http.get('/web/console/article?id=' + id)
                    .then((response)=> {
                        let res = JSON.parse(response.body)
                        let code = res.retcode
                        let desc = res.retdesc
                        let data = res.data
                        switch (code){
                            case 200:
                                this.input = data.article.content
                                this.title = data.article.title
                                this.date = data.article.date
                                this.id = data.article._id
                                break
                            case 410:
                                this.popLogin()
                                break
                            case 430:
                                this.pop({
                                    content: desc,
                                    btn1: '返回',
                                    cb1: ()=>{
                                        window.history.back(-1)
                                    }
                                })
                                break
                            default:
                                this.pop(desc)
                        }
                    })
            } else {
                this.date = new Date().toLocaleDateString()
            }
        },

        methods: {
            popLogin,
            send(){
                this.title = this.title.trim()
                if (!this.title) {
                    this.pop('请输入标题')
                    return
                }
                if (!this.dateStr.trim()) {
                    this.date = new Date()
                }
                this.$http.post('/web/saveArticle', this.$data)
                .then((response)=> {
                    let res = JSON.parse(response.body)
                    let code = res.retcode
                    let desc = res.retdesc
                    let data = res.data
                    switch (code){
                        case 200:
                            this.pop({
                                content: '保存成功!',
                                cb1: ()=>{
                                    this.$router.go('/console/articleList')
                                }
                            })
                            break
                        case 410:
                            this.popLogin(this.send)
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
            },
            editToggle(){
                this.view = this.view === 'edit' ? 'inspect' : 'edit'
            },
        },
        computed: {
            dateStr: {
                set(value){
                    value = value.trim()
                    let reg = /(\d{4})年(\d+)月(\d+)日/
                    if (reg.test(value)) {
                        let date = RegExp.$1
                                + '/' + RegExp.$2
                                + '/' + RegExp.$3
                        this.date = new Date(date)

                    } else {
                        this.date = new Date()
                    }
                },

                get(){
                    let d = new Date(this.date)
                    if (d != 'Invalid Date') {
                        return d.getFullYear() + '年' +
                                (d.getMonth() + 1) + '月' +
                                d.getDate() + '日'
                    } else {
                        return '日期不合法'
                    }
                }
            }
        },
        ready(){
            hljs.initHighlighting()
            hljs.initHighlighting.called = false
        },
        vuex: {
            actions: {
                pop
            }
        }
    }
</script>
<style lang="sass">
    @import "../style/components/Editor.scss";
</style>