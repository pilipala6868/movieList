#! pyton3
# 根据豆瓣ID爬取豆瓣信息

import re, os, requests, openpyxl, bs4

url = 'https://movie.douban.com/subject/'

# 获取excel中电影豆瓣id
commentExcel = openpyxl.load_workbook('观看数据.xlsx')
commentSheetNames = commentExcel.sheetnames
commentSheet = commentExcel[commentSheetNames[0]]

commentTotalRow = commentSheet.max_row

failedID = []
# 逐个访问豆瓣
for i in range(commentTotalRow):
	try:
		commentID = commentSheet['A%d' % (i+1)].value
		# 打开链接
		print('Getting url %d...' % (i+1))
		res = requests.get(url + str(commentID))
		res.raise_for_status()
		soup = bs4.BeautifulSoup(res.text, "html.parser")

		# 获取信息
		commentContent = soup.select('#hot-comments .hide-item full')
		if len(commentContent) != 0:
			commentContent = commentContent[0].getText()
		else:
			commentContent = soup.select('#hot-comments .short')[0].getText()

		# 写入excel
		commentSheet['B%d' % (i+1)] = commentContent

	except:
		print("Comment %d is failed." % (i+1))
		failedID.append(i+1)

	# break

# 保存excel
commentExcel.save('观看数据.xlsx')

# 报结果
if len(failedID) == 0:
	print('ALL SUCCESS!')
else:
	print('Failed:', end='')
	for i in failedID:
		print(' ' + str(i), end='')