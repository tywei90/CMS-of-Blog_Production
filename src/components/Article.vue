<template>
    <div class="wrap">
        <my-header></my-header>
        <section class="article">
            <article class="post-block">
                <div class="post-title">{{title}}</div>
                <div class="post-info">{{date}}</div>
                <div class="post-content">
                    {{{content | marked}}}
                </div>
            </article>
        </section>
        <my-footer></my-footer>
    </div>
</template>
<script>
    import myHeader     from './MyHeader.vue'
    import myFooter     from './MyFooter.vue'
    import marked       from '../js/marked.min'
    import hljs         from '../js/highlight.min'
    import {bgToggle, pop}   from '../vuex/actions'
    import {set, get}    from '../js/cookieUtil'

    export default{
        data(){
            return {
                title: '',
                date: '',
                content: ''
            }
        },
        filters: {
            marked
        },
        route: {
            canReuse:()=>false
        },
        watch: {
            content: hljs.initHighlighting
        },
        created(){
            // 登录状态进入页面，重新计时cookie失效时间
            let userName = get('user')
            if (userName) {
                let date = new Date(Date.now() + 60000 * 30)
                let hostName = location.hostname
                set('user', userName, date, '/', hostName)
            }
            let id = this.$route.query.id
            // 获取访问博客的用户名(地址栏上)
            var href = document.URL
            var indexEnd = href.lastIndexOf('#!')
            var indexStart = href.lastIndexOf('/', indexEnd) + 1
            let visitUserName = href.slice(indexStart, indexEnd)
            this.$http.post('/web/common/article?id=' + id, {name: visitUserName})
                    .then((response)=> {
                        let res = JSON.parse(response.body)
                        let code = res.retcode
                        let desc = res.retdesc
                        let data = res.data
                        switch (code){
                            case 200:
                                this.content = data.article.content
                                this.title = data.article.title
                                let d = new Date(data.article.date)
                                this.date = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日'
                                break
                            case 420:
                                this.pop({
                                    content: desc,
                                    btn1: '去首页',
                                    cb1: ()=>{
                                         location.href="/#!/"
                                    }
                                })
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
                    }, (response)=> {
                        console.log(response)
                    })
        },
        components: {
            myHeader,
            myFooter
        },
        ready(){
            this.bgToggle('MyCanvas')
            hljs.initHighlighting()
            hljs.initHighlighting.called = false
        },
        vuex: {
            actions: {
                bgToggle,
                pop
            }
        }
    }
</script>
<style lang="sass">
    @import "../style/components/Article.scss";
</style>