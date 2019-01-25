#! python3
# 把excel数据录入数据库

import pymysql, re

# 打开数据库连接
db = pymysql.connect("localhost", "pilipala6868", "hz19971023", "movielist" )
cursor = db.cursor()

# 条目总数
cursor.execute('select count(*) from movie')
allNum = cursor.fetchall()[0][0]

# 将excel信息逐条录入
for i in range(allNum):

	sqlConmend = """select intro from movie where movie_id = %s""" % (str(i+1))

	# 执行SQL
	try:
		cursor.execute(sqlConmend)
		intro = cursor.fetchall()[0][0]
		if re.search('©豆瓣', intro) != None:
			intro = intro.replace('©豆瓣', '')
			try:
				cursor.execute("update movie set intro = '%s' where movie_id = %s" % (intro, (str(i+1))))
				db.commit()
			except:
				print("Update error at No.%d" % (i+1))
	except:
		print("Select error at No.%d" % (i+1))

# 关闭数据库连接
db.close()
