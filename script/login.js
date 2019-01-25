
var papa = window.parent;
var leftWindow = papa.document.getElementById('leftFrame').contentWindow;

$(document).ready(function() {
	//检查是否注销
	if (getUrlPar('type'))
		leftWindow.tourist();  //变为游客模式
	else
		$("#mainBox").show();  //防止注销时登录页面闪现一下

	//一开始聚焦在用户名输入框
	$(".loginInput:eq(0)").focus();
});

//点击游客
function touristClick()
{
	leftWindow.tourist();
}

//点击登录
function loginClick()
{
	//获取、检查输入
	var username = $(".loginInput:eq(0)").val().trim();
	var password = $(".loginInput:eq(1)").val().trim();
	if (username == "")
	{
		alert("请输入用户名");
		$(".loginInput:eq(0)").focus();
		return false;
	}
	if (password == "")
	{
		alert("请输入密码");
		$(".loginInput:eq(1)").focus();
		return false;
	}

	//校对登录密码
	var sql = "SELECT password FROM user WHERE username = '{0}'".format(username);
	papa.db.query(sql).then(function(result) {
		if (result.length == 0)
		{
			alert("用户名不存在");
			$(".loginInput:eq(0)").focus();
			return false;
		}
		else if (result[0].password != password)
		{
			alert("密码错误");
			$(".loginInput:eq(1)").focus();
			return false;
		}
		else
		{
			alert("登录成功");
			leftWindow.login();
		}
	});

}
