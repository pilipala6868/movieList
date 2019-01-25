
$(document).ready(function()
{
	var pageSize = 13;  //每页13条
	var p = getUrlPar('p');  //当前页
	if (p == false)
		p = 1;
	var startNum = (p-1) * pageSize;  //起始查询条目序号

	var papa = window.parent;

	//电影条目查询显示
	var sql = "SELECT * FROM record, movie WHERE record.movie_id = movie.movie_id ORDER BY record.record_id DESC LIMIT {0}, {1};".format(startNum, pageSize);
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
		var pageHTML = '';
		for (var i=1; i<=pageSum; i++)
		{
			if (i == p)
				pageHTML += "<span class='page_num' id='page_num_now'>{0}</span>".format(i);
			else
				pageHTML += "<a href='movie_list.html?p={0}'><span class='page_num'>{0}</span></a>".format(i);
		}
		$("#pages").append(pageHTML);
	});

});
