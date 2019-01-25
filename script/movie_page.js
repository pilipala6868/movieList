
$(document).ready(function()
{
	var papa = window.parent;
	var record_id = getUrlPar('id');  //当前记录id
	
	if (getUrlPar('from'))  //如果是影人页来的，先把movie_id转record_id
	{
		var sql = "SELECT * FROM record WHERE movie_id = {0};".format(record_id);
		papa.db.query(sql).then(function(result) {
			record_id = result[0].record_id;  //当前记录id
			showMovieData();  //不能放在外面，否则怕还没查好记录id便执行了接下来的查询操作
		});
	}
	else
		showMovieData();

	//电影详情查询显示
	function showMovieData()
	{
		var sql = "select movie.*, record.*, director.name_ch as dname_ch, director.director_id as did, actor1.name_ch as a1name_ch, actor1.actor_id as a1id, actor2.name_ch as a2name_ch, actor2.actor_id as a2id, actor3.name_ch as a3name_ch, actor3.actor_id as a3id from movie \
			left join record on movie.movie_id = record.movie_id \
			left join director on movie.director_id = director.director_id \
			left join actor actor1 on movie.actor1_id = actor1.actor_id \
			left join actor actor2 on movie.actor2_id = actor2.actor_id \
			left join actor actor3 on movie.actor3_id = actor3.actor_id \
			where record.record_id = {0};".format(record_id);

		papa.db.query(sql).then(function(movieInfo) {
			//评分转星星数
			var score = movieInfo[0].score;
			var fullStar = Math.floor(score / 2);
			var halfStar = score % 2 >= 1 ? 1 : 0;
			// var emptyStar = 5 - fullStar - halfStar;
			//星星html
			var stars = '';  
			for (var i=0; i<fullStar; i++)
				stars += '<i class="fa fa-star"></i>';
			if (halfStar == 1)
				stars += '<i class="fa fa-star-half-o"></i>';

			//剧情简介
			var intros = movieInfo[0].intro.split('\n');
			var introHTML = '';
			for (var i=0; i<intros.length; i++)
				introHTML += '<p>' + intros[i].trim() + '</p>';
			//短评
			var talk = movieInfo[0].talk.split('\n');
			var talkHTML = '';
			for (var i=0; i<talk.length; i++)
				talkHTML += '<p>' + talk[i].trim() + '</p>';

			//数据填入
			new Vue({
			  	el: '#mainBox',
			  	data: {
				    mInfo: movieInfo[0],
				    stars: stars,
				    intro: introHTML,
				    talk: talkHTML
			  	}
			});
		});
	}
});
