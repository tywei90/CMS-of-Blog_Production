<template>
    <div class="wrap">
        <my-header></my-header>
        <section class="archive" v-if="isShow">
            <ul v-if="articles.length > 0">
                <li class="item"
                    v-for="year in years">
                    <p>{{year}}</p>
                    <ul>
                        <li class="f-cb" v-for="article in archive[year]">
                            <span class="date f-fl">
                                {{article.date | dateParse}}
                            </span>
                            <span class="title f-fl"
                                  @click="detail(article._id)">
                                {{article.title}}
                            </span>
                        </li>
                    </ul>
                </li>
            </ul>
            <div v-if="!articles.length && !isSelf">博主很懒，还没有发布文章哦~</div>
            <div v-if="!articles.length && isSelf" class="welcome">
                <div class="post-title">欢迎使用博客系统</div>
                <div class="post-content">
                    <p>此博客系统前端是用vue全家桶搭建的，负责路由跳转，是个单页面应用。后台用的nodejs的express框架，用mongoose驱动mongodb数据库来实现数据库管理。</p>
                    <p>此博客系统支持一下功能：</p>
                    <ol>
                        <li>一个基本的博客内容管理器功能，如发布并管理文章等</li>
                        <li>每个用户可以通过注册拥有自己的博客</li>
                        <li>支持<a href="http://www.appinn.com/markdown/basic.html">markdown语法编辑</a></li>
                        <li>支持代码高亮</li>
                        <li>可以管理博客页面的链接</li>
                        <li>博客页面对移动端适配优化</li>
                        <li>账户管理(修改密码)</li>
                        <li>页面足够大气、酷炫嘿</li>
                    </ol>
                    <p>点击<a :href="createArticle">这里</a>，发表自己的第一篇文章吧</p>
                </div>
            </div>
        </section>
        <my-footer></my-footer>
    </div>
</template>
<script>
    import myHeader     from './MyHeader.vue'
    import myFooter     from './MyFooter.vue'
    import {bgToggle, pop}   from '../vuex/actions'
    import {set, get}    from '../js/cookieUtil'
    export default{
        data(){
            return {
                articles: null,
                years:[1],
                isShow: false,
                isSelf: false
            }
        },
        filters: {
            dateParse: value=> {
                let d = new Date(value)
                if(window.innerWidth < 700){
                    return (d.getMonth() + 1) + '月' +
                        d.getDate() + '日'
                }else{
                    return d.getFullYear() + '年' +
                        (d.getMonth() + 1) + '月' +
                        d.getDate() + '日'
                }
            }
        },
        created(){
            // 登录状态进入页面，重新计时cookie失效时间
            let userName = get('username');
            if (userName) {
                let date = new Date(Date.now() + 60000 * 30);
                let hostName = location.hostname;
                set('username', userName, date, '/', hostName);
            }
            // 获取访问博客的用户名(地址栏上)
            var href = document.URL;
            var indexEnd = href.lastIndexOf('#!');
            var indexStart = href.lastIndexOf('/', indexEnd) + 1;
            let visitUserName = href.slice(indexStart, indexEnd);
            this.isSelf = userName === visitUserName;
            this.$http.post('/web/common/articleList', {name: visitUserName})
                .then((response)=> {
                    let res = JSON.parse(response.body)
                    let code = res.retcode
                    let desc = res.retdesc
                    let data = res.data
                    switch (code){
                        case 200:
                            this.articles = data.articles.sort((i, j)=> {
                                return new Date(j.date) - new Date(i.date)
                            });
                            this.isShow = true;
                            break
                        case 420:
                            this.pop({
                                content: desc,
                                btn1: '去首页',
                                cb1: ()=>{
                                     location.href="/#!/"
                                },
                                wapGoDialog: true
                            })
                            break
                        default:
                            this.pop({
                                content: desc,
                                btn1: '返回',
                                cb1: ()=>{
                                    window.history.back(-1); 
                                },
                                wapGoDialog: true
                            })
                    }
                    
                }, (response)=> {
                    console.log(response)
                })
        },
        ready(){
            this.bgToggle('MyCanvas')
        },
        methods: {
            detail(id){
                this.$router.go('/article?id=' + id)
            }
        },
        components: {
            myHeader,
            myFooter,
        },
        computed: {
            archive(){
                if (!this.articles) {
                    return {1:[{title:'',date:''}]}
                }
                let archive = {}
                this.years.splice(0,1)
                this.articles.forEach(atc=> {
                    let year = new Date(atc.date).getFullYear()
                    if (!archive[year]) {
                        this.years.push(year)
                        archive[year] = []
                    }
                    archive[year].push(atc)
                })
                return archive
            },
            createArticle(){
                let userName = get('username');
                return '/' + userName + '#!/console/editor';
            }
        },
        vuex:{
            actions:{
                bgToggle,
                pop
            }
        }
    }
</script>
<style lang="sass">
    @import "../style/common.scss";
    @import "../style/components/Archive.scss";
</style>