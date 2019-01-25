
$(document).ready(function() {
    //一开始便foucs输入框
    $("#inputDiv input").focus();

    var papa = window.parent;

    //点击图片随机电影
    papa.db.query('select count(*) from movie;').then(function(countNum) {
        var randomId = Math.floor(Math.random() * countNum[0]['count(*)']) + 1;
        //数据填入
        new Vue({
            el: '#searchTop',
            data: { randomId: randomId }
        });
    });

    //搜索
    var firstSearch = true;  //是否第一次搜索
    $("#search button").click(function() {
        var inputText = $.trim($("#inputDiv input").val());
        //输入为空
        if (inputText == "")
        {
            $("#inputDiv input").val("").focus();
            return;
        }
        //搜索
        search(inputText);
        //输入框上移
        if (firstSearch)
        {
            $("#searchTop").hide(200);
            firstSearch = false;
        }
    });

    //数据库搜索
    function search(inputText)
    {
        //查询显示
        var sql = "SELECT movie.movie_id, movie.name_ch as mname_ch, movie.intro, actor1.*, actor2.*, actor3.*, director.* \
            FROM movie, actor actor1, actor actor2, actor actor3, director \
            WHERE movie.director_id = director.director_id \
            AND movie.actor1_id = actor1.actor_id \
            AND movie.actor2_id = actor2.actor_id \
            AND movie.actor3_id = actor3.actor_id \
            AND (movie.name_ch LIKE '%{0}%' \
            OR actor1.name_ch LIKE '%{0}%' \
            OR actor2.name_ch LIKE '%{0}%' \
            OR actor3.name_ch LIKE '%{0}%' \
            OR director.name_ch LIKE '%{0}%');"
            .format(inputText);

        papa.db.query(sql).then(function(sInfo) {
            //无搜索结果
            if (sInfo.length == 0)
            {
                //隐藏已有结果
                $(".infoBox").fadeOut(100);
                //not found的html
                $("#notFound").show(200);
                return;
            }
            //重建vue模板
            $("#allItem").html("<div class='infoBox' v-for=\"r in results\"> \
                        <a :href=\"'movie_page.html?id=' + r.movie_id\"> \
                            <div class='searchTitle'>{{r.mname_ch}}</div> \
                            <div class='searchText'>{{r.intro}}</div> \
                        </a> \
                    </div>");
            //缩略剧情简介
            for (var i=0; i<sInfo.length; i++)
                if (sInfo[i].intro.length > 200)
                    sInfo[i].intro = sInfo[i].intro.slice(0, 200) + '...';

            //数据填入
            new Vue({
                el: '#allItem',
                data: {
                    results: sInfo
                }
            });
            //显示
            $("#notFound").hide(100);
            $(".infoBox").fadeIn(200);
        });
    }

    //回车搜索
    $("#inputDiv input").keydown(function(){     
        if (event.keyCode == "13")
            $("#search button").trigger('click');
    });

});