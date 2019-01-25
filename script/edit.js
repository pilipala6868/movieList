
var papa = window.parent;

$(document).ready(function()
{
	var pageSize = 12;  //每页数目
	var p = getUrlPar('p');  //当前页
	if (p == false)
		p = 1;
	var startNum = (p-1) * pageSize;  //起始查询条目序号

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
				pageHTML += "<a href='edit.html?p={0}'><span class='page_num'>{0}</span></a>".format(i);
		}
		$("#pages").append(pageHTML);
	});


    //搜索
    $("#searchBox span").click(function() {
        var inputText = $.trim($("#searchBox input").val());
        //输入为空
        if (inputText == "")
        {
            $("#searchBox input").val("").focus();
            return;
        }
        //搜索
        search(inputText);
        $("#pages").html('');
    });

    //数据库搜索
    function search(inputText)
    {
        //查询显示
        var sql = "SELECT * \
            FROM movie, record \
            WHERE movie.movie_id = record.movie_id \
            AND movie.name_ch LIKE '%{0}%' \
            ORDER BY record.record_id DESC;"
            .format(inputText);

        papa.db.query(sql).then(function(sInfo) {
            //无搜索结果
            if (sInfo.length == 0)
            {
                $("#all_movie_table").html("<tr class='movieBox' style='height: 42px;'> \
		                <td class='movie_id'></td> \
		                <td class='movie_name'>Not Found</td> \
		                <td class='name_eng'></td> \
		                <td class='watch_date'></td> \
		                <td class='score'></td> \
		                <td class='editBt'></td> \
		            </tr>");
                return;
            }
            //重建vue模板
            $("#all_movie_table").html("<tr class='movieBox' v-for=\"mItem in mItems\" v-cloak> \
		                <td class='movie_id'>{{mItem.record_id}}</td> \
		                <td class='movie_name'>{{mItem.name_ch}} ({{mItem.released}})</td> \
		                <td class='name_eng'>{{mItem.name_en}}</td> \
		                <td class='watch_date'>{{mItem.watched.getMonth()+1+'-'+mItem.watched.getDate()}}</td> \
		                <td class='score'>{{mItem.score}}</td> \
		                <td class='editBt'> \
		                	<a :href=\"'edit_form.html?mid='+mItem.movie_id+'&rid='+mItem.record_id+'&did='+mItem.director_id+'&a1id='+mItem.actor1_id+'&a2id='+mItem.actor2_id+'&a3id='+mItem.actor3_id\" title=\"修改\"><i class='fa fa-edit'></i></a> \
		                </td> \
                        <td class='deleteBt'> \
                        	<a title=\"删除\" :href=\"'javascript: deleteClick('+mItem.movie_id+','+mItem.record_id+','+mItem.director_id+','+mItem.actor1_id+','+mItem.actor2_id+','+mItem.actor3_id+');'\"><i class='fa fa-trash-o'></i></a> \
                        </td> \
		            </tr>");

            //数据填入
            new Vue({
			  	el: '#all_movie_table',
                data: {
				    mItems: sInfo
                }
            });
        });
    }

    //回车搜索
    $("#searchBox input").keydown(function(){     
        if (event.keyCode == "13")
            $("#searchBox span").trigger('click');
    });
});


//删除操作
function deleteClick(mid, rid, did, a1id, a2id, a3id) {
	//确认是否删除
	if (!confirm("确定删除该条数据？"))
		return false;
	aid = [a1id, a2id, a3id];
	//删除record
	sql = "DELETE FROM record WHERE record_id = {0};".format(rid);
	papa.db.query(sql);
	//查看是否有其他记录关联该movie
	sql = "SELECT * FROM record WHERE movie_id = {0};".format(mid);
	papa.db.query(sql).then(function(result) {
		if (result.length == 0)  //无其他关联，删除movie
		{
			//删除海报
			papa.deleteFile('F:\\学习\\Electron\\movielist\\img\\poster\\{0}.jpg'.format(mid));
			
			//删除电影
			sql = "DELETE FROM movie WHERE movie_id = {0};".format(mid);
			papa.db.query(sql).then(function() {
				//查看是否有其他记录关联该director
				sql = "SELECT * FROM movie WHERE director_id = {0};".format(did);
				papa.db.query(sql).then(function(result) {
					if (result.length == 0) {  //无其他关联，删除director
						sql = "DELETE FROM director WHERE director_id = {0};".format(did);
						papa.db.query(sql);
					}
				});
				//查看是否有其他记录关联actor
				function deleteActor(i)
				{
					if (i >= 3) return;

					sql = "SELECT * FROM movie WHERE actor1_id = {0} OR actor2_id = {0} OR actor3_id = {0};".format(aid[i]);
					papa.db.query(sql).then(function(result) {
						if (result.length == 0) {  //无其他关联，删除actor
							sql = "DELETE FROM actor WHERE actor_id = {0};".format(aid[i]);
							papa.db.query(sql);
						}
					});
					deleteActor(i+1);  //递归实现
				}
				deleteActor(0);
			});
		}
	});

	//删除成功，刷新页面
	alert("删除成功");
    window.location.reload();
};