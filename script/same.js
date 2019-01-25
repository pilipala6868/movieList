
$(document).ready(function()
{
	//防止新窗口跳转
    $("a").click(function() 
    {
        window.location.href = $(this).attr('href');
        return false;
    });

});

//字符串内变量替换
String.prototype.format = function() {
    //数据长度为空，则直接返回
    if (arguments.length == 0)
        return this;
 
    //使用正则表达式，循环替换占位符数据
    for (var r=this, i=0; i<arguments.length; i++)
        r = r.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
    return r;
}

//去除字符串两边空格
String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g,'');
}

//获取当前链接参数
function getUrlPar(parameter)
{
	var url = window.location.search.substring(1);
	var vars = url.split("&");
	for (var i=0; i<vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == parameter)
			return pair[1];
	}
	return false;
}