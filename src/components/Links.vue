<template>
    <section class="links">
        <div class="title">链接编辑</div>
        <table>
            <tbody>
            <tr>
                <th>链接名称</th>
                <th>链接地址</th>
                <th>新开页面</th>
            </tr>
            <tr v-for="link in links">
                <td>
                    <i class="icon iconfont icon-jia"
                       @click="addLink($index)"
                       v-if="links.length<4">
                    </i>
                    <i class="icon iconfont icon-jian"
                       @click="removeLink($index)"
                       v-if="links.length>1">
                    </i>
                    <input type="text" v-model="link.name">
                </td>
                <td>
                    <input type="text" v-model="link.href">
                </td>
                <td>
                    <span class="check" @click="changeCheckState($index)">
                        <i class="icon iconfont icon-fuxuangougou" :class="{'unChecked': !link.newPage}"></i>
                    </span>
                </td>
            </tr>
            </tbody>
        </table>
        <div class="panel">
            <button @click="saveLinks">保存</button>
        </div>
    </section>
</template>

<script>
    import {pop}        from '../vuex/actions'
    import popLogin     from '../js/login'

    export default{
        data(){
            return {
                links: null
            }
        },
        created(){
            this.$http.get('/web/console/getLinks')
            .then((response)=> {
                let res = JSON.parse(response.body)
                let code = res.retcode
                let desc = res.retdesc
                let data = res.data
                switch (code){
                    case 200:
                        this.links = data.links
                        break
                    case 410:
                        this.popLogin()
                        break
                    default:
                        this.pop(desc)
                }
            }, (response)=> {
                console.log(response)
            })
        },
        methods: {
            popLogin,
            changeCheckState(index){
                this.links[index].newPage = !this.links[index].newPage
            },
            addLink(i){
                this.links.splice(i + 1, 0, {
                    name: '',
                    href: '',
                    newPage: true
                })
            },
            removeLink(i){
                this.links.splice(i, 1)
            },
            saveLinks(){
                this.$http.post('/web/setLinks', this.$data)
                .then((response)=> {
                    let res = JSON.parse(response.body)
                    let code = res.retcode
                    let desc = res.retdesc
                    let data = res.data
                    switch (code){
                        case 200:
                            this.pop('保存成功')
                            break
                        case 410:
                            this.popLogin(this.saveLinks)
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
        },
        vuex: {
            actions: {
                pop
            }
        }
    }
</script>

<style lang="sass">
    @import "../style/components/Links.scss";
</style>