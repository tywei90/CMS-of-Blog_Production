<template>
    <div class="nightSky">
        <div class='stars1'></div>
        <div class='stars2'></div>
        <div class='stars3'></div>
    </div>
</template>
<script>
	import $  from '../js/jquery.min'
    export default{
    	ready(){
    		// 修改页面超过一屏底部白色的bug
    		var h1 = $(document).height();
            var h2 = $(window).height();
            alert(h1);
            alert(h2);
            setTimeout(()=>{
                $('.nightSky').css('bottom', (h2 - h1)+'px');
            }, 0)
    	}
    }
</script>
<style lang="sass">
@import "../style/components/NightSky.scss";
</style>