<template>
    <div class="wrap">
        <my-header></my-header>
        <section class="archive">
            <ul>
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
            }
        },
        filters: {
            dateParse: value=> {
                let d = new Date(value)
                return d.getFullYear() + '年' +
                        (d.getMonth() + 1) + '月' +
                        d.getDate() + '日'
            }
        },
        created(){
            // 登录状态进入页面，重新计时cookie失效时间
            let userName = get('user')
            if (userName) {
                let date = new Date(Date.now() + 60000 * 30)
                let hostName = location.hostname
                set('user', userName, date, '/', hostName)
            }
            // 获取访问博客的用户名(地址栏上)
            var href = document.URL
            var indexEnd = href.lastIndexOf('#!')
            var indexStart = href.lastIndexOf('/', indexEnd) + 1
            let visitUserName = href.slice(indexStart, indexEnd)
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
                            })
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