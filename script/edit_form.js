
$(document).ready(function()
{
    var papa = window.parent;
    //获取链接参数
    var movie_id = getUrlPar('mid');
    var record_id = getUrlPar('rid');
    var director_id = getUrlPar('did');
    var actor_id = [getUrlPar('a1id'), getUrlPar('a2id'), getUrlPar('a3id')];

    //初始为空
    var allInput = new Vue({
        el: '#insertForm',
        data: {
            mname_ch: '', mname_en: '', released: '', category: '', country: '', watched: '', score: '', intro: '', talk: '', dname_ch: '', dname_en: '', dsex: '', dnative: '', a1name_ch: '', a1name_en: '', a1sex: '', a1native: '', a2name_ch: '', a2name_en: '', a2sex: '', a2native: '', a3name_ch: '', a3name_en: '', a3sex: '', a3native: ''
        },
        methods: {
            //输入框修改便执行sql
            edit: function(num) {
             　　//询问确定修改
                var f0 = ['name_ch', 'name_en', 'released', 'category', 'country', 'intro', 'watched', 'score', 'talk', 'name_ch', 'name_en', 'sex', 'native', 'name_ch', 'name_en', 'sex', 'native', 'name_ch', 'name_en', 'sex', 'native', 'name_ch', 'name_en', 'sex', 'native'];
                var f1 = ['mname_ch', 'mname_en', 'released', 'category', 'country', 'intro', 'watched', 'score', 'talk', 'dname_ch', 'dname_en', 'dsex', 'dnative', 'a1name_ch', 'a1name_en', 'a1sex', 'a1native', 'a2name_ch', 'a2name_en', 'a2sex', 'a2native', 'a3name_ch', 'a3name_en', 'a3sex', 'a3native'];
                if (num <= 5) {  //修改movie
                    var sql = "UPDATE movie SET {0} = '{1}' WHERE movie_id = {2};".format(f0[num], this[f1[num]], movie_id);
                }
                else if (num <= 8) {  //修改record
                    if (num == 8)
                        var sql = "UPDATE record SET {0} = '{1}' WHERE record_id = {2};".format(f0[num], this[f1[num]], record_id);
                    else
                        var sql = "UPDATE record SET {0} = {1} WHERE record_id = {2};".format(f0[num], this[f1[num]], record_id);
                }
                else if (num <= 12) {  //修改director
                    var sql = "UPDATE director SET {0} = '{1}' WHERE director_id = {2};".format(f0[num], this[f1[num]], director_id);
                }
                else {  //修改actor
                    var temp = Math.floor((num - 13) / 4);
                    var sql = "UPDATE actor SET {0} = '{1}' WHERE actor_id = {2};".format(f0[num], this[f1[num]], actor_id[temp]);
                }
                //执行修改
                papa.db.query(sql);
                //短暂提示修改成功
                $("#editOK").slideDown(400, function() {
                    $(this).delay(2500).slideUp(400);
                });
            },

            //修改海报文件
            editFile: function() {
                //获取上传海报图片路径
                var filePath = $(".inputFile")[0].files[0].path;

                //图片上传移动，覆盖
                var filename = movie_id + '.jpg';
                var fileTo = 'F:\\学习\\Electron\\movielist\\img\\poster\\' + filename;
                papa.copyIt(filePath, fileTo);

                //短暂提示修改成功
                $("#editOK").slideDown(400, function() {
                    $(this).delay(2500).slideUp(400);
                });
            }
        }
    });


    //电影、记录查询填入
    var allData = allInput._data;
    var sql = "SELECT * FROM record, movie \
        WHERE record.record_id = {0} \
        AND movie.movie_id = record.movie_id;".format(record_id);
    papa.db.query(sql).then(function(info) {
        //数据填入
        allData.mname_ch = info[0].name_ch;
        allData.mname_en = info[0].name_en;
        allData.released = info[0].released;
        allData.category = info[0].category;
        allData.country = info[0].country;
        allData.watched = info[0].watched.getFullYear()+'-'+(info[0].watched.getMonth()+1)+'-'+info[0].watched.getDate();
        allData.score = info[0].score;
        allData.intro = info[0].intro;
        allData.talk = info[0].talk;
    });
    //导演查询填入
    sql = "SELECT * FROM director WHERE director_id = {0};".format(director_id);
    papa.db.query(sql).then(function(info) {
        //数据填入
        allData.dname_ch = info[0].name_ch;
        allData.dname_en = info[0].name_en;
        allData.dsex = info[0].sex;
        allData.dnative = info[0].native;
    });
    //演员查询填入
    function searchActor(i)
    {
        if (i>=3) return;
        sql = "SELECT * FROM actor WHERE actor_id = {0};".format(actor_id[i]);
        papa.db.query(sql).then(function(info) {
            //数据填入
            allData['a{0}name_ch'.format(i+1)] = info[0].name_ch;
            allData['a{0}name_en'.format(i+1)] = info[0].name_en;
            allData['a{0}sex'.format(i+1)] = info[0].sex;
            allData['a{0}native'.format(i+1)] = info[0].native;
        });
        searchActor(i+1);
    }
    //递归实现，否则for中的异步会让i值错误
    searchActor(0);


    //输入框按回车，失焦修改
    $("#insertForm input").keydown(function(){     
        if (event.keyCode == "13")
            $(this).blur();
    });

    //完成按钮，跳转电影页
    $("#form_button").click(function() {
        window.location.href = "movie_page.html?id={0}".format(record_id);
    })
});
