$(document).ready(function()
{
    var papa = window.parent;
    var movie = papa.db.model({table: 'movie'});
    var record = papa.db.model({table: 'record'});
    var director = papa.db.model({table: 'director'});
    var actor = papa.db.model({table: 'actor'});

    //点击提交表单
    $("#form_button").click(function() {
	 　　//点击确定后操作
    	if (!confirm("确认提交电影信息？"))
		　　return false;

    	//获取表单数据
    	var formData = getFormData();

    	//检查表单填写
    	if (!testFormFill(formData))
    		return false;
    	
		//检测是否新电影
		var sql = "SELECT * FROM movie WHERE name_ch = '{0}';".format(formData.mname_ch);
		papa.db.query(sql).then(function(r) {
			//电影已存在
			if (r.length > 0)
			{
				if (formData.mname_en == "" || r[0].name_en == formData.mname_en)
				{
					//直接插入新记录
					record({
						movie_id: 	r[0].movie_id,
						watched: 	formData.watched,
						talk: 		formData.talk,
						score: 		formData.score
					}).save();
				}
			}
			//新电影
			else
			{
				//处理可能null数据
				if (formData.mname_en == "")
					formData.mname_en = null;
				if (formData.a1name_en == "")
					formData.a1name_en = null;
				if (formData.a2name_en == "")
					formData.a2name_en = null;
				if (formData.a3name_en == "")
					formData.a3name_en = null;

				//避免因sql接口异步出错设的flag
				var dFlag = false;
				var a1Flag = false;
				var a2Flag = false;
				var a3Flag = false;

				//获取上传海报图片路径
				var filePath = $(".inputFile")[0].files[0].path;

				//插入新电影和记录
				sql = "SELECT AUTO_INCREMENT FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = \"movie\";"
			    papa.db.query(sql).then(function(r) {
			    	var next_id = r[0]['AUTO_INCREMENT'];
			    	//电影
					var movieInsert = movie({
						name_ch: 	formData.mname_ch,
						name_en:  	formData.mname_en,
						category:  	formData.category,
						country:  	formData.country,
						intro:  	formData.intro,
						released: 	formData.released,
					  	poster: 	'{0}.jpg'.format(next_id)
					});
					//检测导演是否存在，填入导演
					sql = "SELECT * FROM director WHERE name_ch = '{0}'".format(formData.dname_ch)
					papa.db.query(sql).then(function(r) {
						if (r.length > 0)
							movieInsert.director_id = r[0].director_id;
						else
							movieInsert.director = director({
							    name_ch: formData.dname_ch,
							    name_en: formData.dname_en,
							    sex: formData.dsex,
							    native: formData.dnative
							});
						dFlag = true;
					});
					//检测演员1是否存在，填入
					if (formData['a1name_ch'] == "")  //未填入演员
					{
						movieInsert['actor1_id'] = null;
						a1Flag = true;
					}
					else
					{
						sql = "SELECT * FROM actor WHERE name_ch = '{0}'".format(formData['a1name_ch'])
						papa.db.query(sql).then(function(r) {
							if (r.length > 0)
								movieInsert['actor1_id'] = r[0].actor_id;
							else
								movieInsert['actor1'] = actor({
								    name_ch: formData['a1name_ch'],
								    name_en: formData['a1name_en'],
								    sex: formData['a1sex'],
								    native: formData['a1native']
								});
							a1Flag = true;
						});
					}
					//检测演员2是否存在，填入
					if (formData['a2name_ch'] == "")  //未填入演员
					{
						movieInsert['actor2_id'] = null;
						a2Flag = true;
					}
					else
					{
						sql = "SELECT * FROM actor WHERE name_ch = '{0}'".format(formData['a2name_ch'])
						papa.db.query(sql).then(function(r) {
							if (r.length > 0)
								movieInsert['actor2_id'] = r[0].actor_id;
							else
								movieInsert['actor2'] = actor({
								    name_ch: formData['a2name_ch'],
								    name_en: formData['a2name_en'],
								    sex: formData['a2sex'],
								    native: formData['a2native']
								});
							a2Flag = true;
						});
					}
					//检测演员3是否存在，填入
					if (formData['a3name_ch'] == "")  //未填入演员
					{
						movieInsert['actor3_id'] = null;
						a3Flag = true;
					}
					else
					{
						sql = "SELECT * FROM actor WHERE name_ch = '{0}'".format(formData['a3name_ch'])
						papa.db.query(sql).then(function(r) {
							if (r.length > 0)
								movieInsert['actor3_id'] = r[0].actor_id;
							else
								movieInsert['actor3'] = actor({
								    name_ch: formData['a3name_ch'],
								    name_en: formData['a3name_en'],
								    sex: formData['a3sex'],
								    native: formData['a3native']
								});
							a3Flag = true;
						});
					}

					//海报上传移动
					var filename = next_id + '.jpg';
					var fileTo = 'F:\\学习\\Electron\\movielist\\img\\poster\\' + filename;
					papa.copyIt(filePath, fileTo);

					//记录上传内容
					var recordInsert = record({
						movie_id: 	next_id,
						watched: 	formData.watched,
						talk: 		formData.talk,
						score: 		formData.score
					});

					//根据flag提交插入，避免因sql接口异步出错
					function submitInsert()
					{
						if (dFlag == true && a1Flag == true && a2Flag == true && a3Flag == true)
						{
							movieInsert.save();
							recordInsert.save();
							//关闭定时器
							clearInterval(goSubmit);
						}
					}

					var goSubmit = setInterval(function() {
						submitInsert();
					}, 200);
			    });
			}

			//插入完成后清空表单
			alert("提交成功！");
			$('input').val("");
			$('textarea').val("");
		});
    });

    //获取表单数据
    function getFormData()
    {
    	//格式化表单数据变量
    	var f = $("#insertForm").serializeArray();
    	var formData = {};
    	for (var i=0; i<f.length; i++)
    		formData[f[i].name] = f[i].value.trim();
    	return formData;
    }

    //检测表单填写
    function testFormFill(formData)
    {
    	if (formData.mname_ch == "")
    	{
    		alert("请输入电影中文名");
    		return false;
    	}
    	if (formData.watched == "")
    	{
    		alert("请输入观看日期");
    		return false;
    	}
    	if (formData.score == "")
    	{
    		alert("请输入评分");
    		return false;
    	}
    	//确定是新增电影，则检查导演和一个演员
    	if (formData.category != "")
    	{
    		if (formData.dname_ch == "")
	    	{
	    		alert("请输入导演名称");
	    		return false;
	    	}
	    	if (formData.a1name_ch == "")
	    	{
	    		alert("请输入演员名称");
	    		return false;
	    	}
	    }
	    return true;
    }

});
