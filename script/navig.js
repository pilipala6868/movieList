
$(document).ready(function()
{
	//当前所在板块
	var boxNow = 6;
	$('.blockBox:eq('+(boxNow-1)+')').css('border-color', '#efc064');

	//点击模块变边框，右边iframe跳转
	$("#mainBox a").click(function() 
	{
		//灰色模块点击无效
		if ($(this).children('div').hasClass('grayBox'))
			return false;

		//边框变色
		$('.blockBox').css('border-color', 'transparent');
		$(this).children('.blockBox').css('border-color', '#efc064');
		boxNow = $(this).index();

		//跳转
		var jumpTo = $(this).attr('href');
		$(window.parent.document).find("#rightFrame").attr('src', jumpTo);
		return false;
	});

});

//游客模式
function tourist()
{
	//移除灰色
	if ($('.blockBox:eq(0)').hasClass('grayBox'))
	{
		$('.blockBox:eq(0)').removeClass('grayBox');
		$('.blockBox:eq(1)').removeClass('grayBox');
		$('.blockBox:eq(4)').removeClass('grayBox');
	}
	//给其他两个加上灰色
	if (!$('.blockBox:eq(2)').hasClass('grayBox'))
	{
		$('.blockBox:eq(2)').addClass('grayBox');
		$('.blockBox:eq(3)').addClass('grayBox');
	}
	//登录板块变为登录
	$('.blockBox:eq(5) span').text('登 录');
	$("#mainBox a:eq(5)").attr('href', 'login.html');

	$('#mainPage').click();
}

//登录模式
function login()
{
	//移除灰色
	$('.blockBox:eq(2)').removeClass('grayBox');
	$('.blockBox:eq(3)').removeClass('grayBox');
	//移除灰色
	if ($('.blockBox:eq(0)').hasClass('grayBox'))
	{
		$('.blockBox:eq(0)').removeClass('grayBox');
		$('.blockBox:eq(1)').removeClass('grayBox');
		$('.blockBox:eq(4)').removeClass('grayBox');
	}
	//登录板块变为注销
	$('.blockBox:eq(5) span').text('注 销');
	$("#mainBox a:eq(5)").attr('href', 'login.html?type=cancellation');

	$('#mainPage').click();
}