
// 数据库连接
var sworm = require('sworm');

var db = sworm.db({
    driver: 'mysql',
    config: {
        user: 'pilipala6868',
        password: 'hz19971023',
        host: 'localhost',
        database: 'movielist'
    }
});


// 图片复制
var fs = require("fs");

function copyIt(from, to) {
	fs.writeFileSync(to, fs.readFileSync(from));
}
function deleteFile(path) {
	fs.unlinkSync(path);
}

