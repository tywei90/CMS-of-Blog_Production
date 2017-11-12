import $   from '../js/jquery.min'

function toggle(store) {
    store.dispatch('TOGGLE')
}

function bgToggle({dispatch},bg) {
    dispatch('BGTOGGLE',bg);
    function changeSize(){
    	// 修改页面超过一屏底部白色的bug
	    var h1 = $(document).height();
	    var h2 = $(window).height();
	    setTimeout(()=>{
	        $('.nightSky').css('bottom', (h2 - h1)+'px');
	    }, 0);
    }
    // 解决android手机输入时候的bug
    $(window).resize(function(event) {
    	changeSize();
    });
    if(bg === 'NightSky'){
    	changeSize();
    }
}

function pop({dispatch}, para) {
	// 如果没有传入任何参数，默认关闭弹窗
	if(para === undefined){
		para = {}
	}
	// 如果只传入字符串，格式化内容为content的para对象
	if(typeof para === 'string'){
		para = {
			content: para
		}
	}
	// 设置默认值
	para.pop = !para.content? false: true
	para.showClose = para.showClose === undefined? true: para.showClose
	para.title = para.title === undefined? '温馨提示': para.title
	para.wapGoDialog = !!para.wapGoDialog
	// 没有传参数
	if(!para.btn1){
		para.btn1 = '我知道了|normal'
	}
	// 没有传class
	if(para.btn1.indexOf('|') === -1){
		para.btn1 = para.btn1 + '|primary'
	}
	let array1 = para.btn1.split('|')
	para.btn1Text = array1[0]
	// 可能会传多个class
	for(let i=1,len=array1.length; i<len; i++){
		if(i==1){
			// class为disabled属性不加'btn-'
			para.btn1Css = array1[1]=='disabled'? 'disabled': 'btn-' + array1[1]
		}else{
			para.btn1Css = array1[i]=='disabled'? ' disabled': para.btn1Css + ' btn-' + array1[i]
		}
	}

	if(para.btn2){
		if(para.btn2.indexOf('|') === -1){
			para.btn2 = para.btn2 + '|normal'
		}
		let array2 = para.btn2.split('|')
		para.btn2Text = array2[0]
		for(let i=1,len=array2.length; i<len; i++){
			if(i==1){
				para.btn2Css = array2[1]=='disabled'? 'disabled': 'btn-' + array2[1]
			}else{
				para.btn2Css = array2[i]=='disabled'? ' disabled': para.btn2Css + ' btn-' + array2[i]
			}
		}
	}
    dispatch('POP', para)
}


export {
    toggle,pop,bgToggle
}