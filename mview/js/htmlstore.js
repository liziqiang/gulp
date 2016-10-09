/* see:
	开发平台
	F.widget.localstorage.LocalStorage.js


*/

( function(){
	var htmlStore = {
		// 获取 key为获取的目标参数,  fun为回调函数
		get : function(key, fun){
			var r = null;
			try{
				r = window.localStorage['_'+key];
			}catch(e){}
			if(r){
				tmp = $.parseJSON(String(r));
				if(tmp && tmp.data && tmp.exp && tmp.time && (new Date()).getTime() - tmp.time < tmp.exp * 1000){
					r = tmp.data;
				}else{
					r = null;
					this.remove(key);
				}
			}
			return $.isFunction(fun) ? $.bind(fun, this)(r) : r;
		},
		// 设置 key为需要设置的目标参数, val为传入的值, exp为过期时间(单位秒), fun为回调函数
		set : function(key, val, exp, fun){
			exp = exp || 365 * 24 * 60 * 60;
			fun = fun || function(){};
			try{
				window.localStorage['_'+key] = JSON.stringify({data : val, exp : exp, time : (new Date()).getTime()});
			}catch(e){}
			return $.bind(fun, this)();
		},
		// 移除 key为需要移除的目标参数, fun为回调函数
		remove : function(key, fun){
			fun = fun || function(){};
			try{
				delete window.localStorage['_'+key];
			}catch(e){}
			return $.bind(fun, this)();
		}
	};
	F.namespace("htmlstore", htmlStore);
})();