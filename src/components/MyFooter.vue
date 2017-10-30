<template>
    <footer>
        <div class="copyright">
            &copy;2016-2017 Tianyao Wei, tywei90@163.com
        </div>
        <div class="login" @click="login">
            站长登陆
        </div>
    </footer>
</template>
<script>
export default{
    methods:{
        login(){
            this.$router.go('/login')
        }
    }
}
</script>
<style lang="sass">
@import "../style/components/MyFooter.scss";
</style>