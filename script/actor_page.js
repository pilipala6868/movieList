
$(document).ready(function()
{
	var actor_type = getUrlPar('type');  //导演&演员
	var actor_id = getUrlPar('id');  //当前影人id
	var papa = window.parent;

	//影人电影查询显示
	if (actor_type == 'director')  //导演
		var sql = "SELECT movie_id, movie.name_ch as mname_ch, movie.name_en as mname_en, category, director.* \
			FROM movie \
			LEFT JOIN director ON director.director_id = movie.director_id \
			WHERE director.director_id = {0}".format(actor_id);
	else  //演员
		var sql = "SELECT movie_id, movie.name_ch as mname_ch, movie.name_en as mname_en, category, actor.* \
			FROM movie \
			LEFT JOIN actor ON (actor.actor_id = movie.actor1_id \
			OR actor.actor_id = movie.actor2_id \
			OR actor.actor_id = movie.actor3_id) \
			WHERE actor.actor_id = {0}".format(actor_id);

	papa.db.query(sql).then(function(actorInfo) {

		//性别的图案
		var genderFaName = 'mars';
		if (actorInfo[0].sex == '女')
			var genderFaName = 'venus';

		//数据填入
		new Vue({
		  	el: '#mainBox',
		  	data: {
			    actorInfo: actorInfo[0],
			    genderFa: genderFaName,
			    mBlocks: actorInfo
		  	}
		});
	});
});
