
$(document).ready(function()
{
	var pageSize = 30;  //每页13条
	var p = getUrlPar('p');  //当前页
	if (p == false)
		p = 1;
	var startNum = (p-1) * pageSize;  //起始查询条目序号
	var papa = window.parent;

	//排序方式
	var order = getUrlPar('order');
	if (order == false)
		order = 'record_id';
	else if (order == 'score')
		$("#pages span:eq(3)").text('按ID排序');

	//电影条目查询显示
	if (order == 'record_id')
		var sql = "SELECT * FROM record, movie WHERE record.movie_id = movie.movie_id ORDER BY record.record_id ASC LIMIT {0}, {1};".format(startNum, pageSize);
	else if (order == 'score')
		var sql = "SELECT * FROM record, movie WHERE record.movie_id = movie.movie_id ORDER BY record.score DESC LIMIT {0}, {1};".format(startNum, pageSize);
	papa.db.query(sql).then(function(movieItems) {
		new Vue({
		  	el: '#all_movie_table',
		  	data: {
			    mItems: movieItems
		  	}
		});
	});

	//页数查询显示
	sql = "SELECT count(*) FROM record;";
	papa.db.query(sql).then(function(movieSum) {
		var sum = movieSum[0]['count(*)'];
		var pageSum = Math.ceil(sum/pageSize);
		//上一页
		if (p == 1)
			$("#pages span:eq(0)").addClass('invalid');
		else
			$("#pages span:eq(0)").click(function() {
				window.location.href = "report.html?p={0}&order={1}".format((parseInt(p)-1), order);
			});
		//下一页
		if (p == pageSum)
			$("#pages span:eq(1)").addClass('invalid');
		else
			$("#pages span:eq(1)").click(function() {
				window.location.href = "report.html?p={0}&order={1}".format((parseInt(p)+1), order);
			});

		//导出报表
		$("#pages span:eq(2)").click(function() {
			//查询得到完整数据
			if (order == 'record_id')
				sql = "SELECT * FROM record, movie WHERE record.movie_id = movie.movie_id ORDER BY record.record_id ASC;";
			else if (order == 'score')
				sql = "SELECT * FROM record, movie WHERE record.movie_id = movie.movie_id ORDER BY record.score DESC;";

			papa.db.query(sql).then(function(allItems) {
				//数据填入
				new Vue({
				  	el: '#exportTable',
				  	data: {
					    allItems: allItems
				  	}
				});
				//导出excel
			    excel = new ExcelGen({
			        "src_id": "exportTable",
			        "show_header": true
			    }).generate();
			});
		});

		//改变排序方式
		$("#pages span:eq(3)").click(function() {
			if (order == 'record_id')
				window.location.href = "report.html?p={0}&order={1}".format(p, 'score');
			else if (order == 'score')
				window.location.href = "report.html?p={0}&order={1}".format(p, 'record_id');
		});

		//完成显示
		$("#mainBox").show(100);
	});

});
