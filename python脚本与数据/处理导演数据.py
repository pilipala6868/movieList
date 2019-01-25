#! pyton3
# 根据豆瓣ID爬取豆瓣信息

import re, os, requests, openpyxl, bs4

# # 提取电影excel中导演豆瓣id
# infoExcel = openpyxl.load_workbook('电影数据.xlsx')
# infoSheetNames = infoExcel.sheetnames
# infoSheet = infoExcel[infoSheetNames[0]]

# totalRow = infoSheet.max_row
# allDirector = []

# for i in range(totalRow):
# 	temp = infoSheet['G%d' % (i+1)].value
# 	if temp not in allDirector:
# 		allDirector.append(temp)
# 		infoSheet['G%d' % (i+1)] = len(allDirector)
# 	else:
# 		infoSheet['G%d' % (i+1)] = allDirector.index(temp) + 1

# # 写入导演数据
# direExcel = openpyxl.load_workbook('导演数据.xlsx')
# direSheetNames = direExcel.sheetnames
# direSheet = direExcel[direSheetNames[0]]

# for i in range(len(allDirector)):
# 	rowContent = [i+1, allDirector[i]]
# 	direSheet.append(rowContent)

# # 保存excel
# infoExcel.save('电影数据.xlsx')
# direExcel.save('导演数据.xlsx')


url = 'https://movie.douban.com/celebrity/'

# 获取excel中导演豆瓣id
direExcel = openpyxl.load_workbook('导演数据.xlsx')
direSheetNames = direExcel.sheetnames
direSheet = direExcel[direSheetNames[0]]

direTotalRow = direSheet.max_row

failedID = []
# 逐个访问豆瓣
for i in range(direTotalRow):
	try:
		direID = direSheet['B%d' % (i+1)].value
		# 打开链接
		print('Getting url %d...' % (i+1))
		res = requests.get(url + str(direID))
		res.raise_for_status()
		soup = bs4.BeautifulSoup(res.text, "html.parser")

		# 获取信息
		name = soup.select('#wrapper #content h1')[0]
		name_c, name_e = name.getText().split(' ', 1)
		otherInfo = soup.select('#wrapper #headline .info ul li')
		male = otherInfo[0].getText().split()[-1]
		native = otherInfo[3].getText().replace(' ', '').replace('\n', '').split(',')[0][4:]

		# 写入excel
		direSheet['B%d' % (i+1)] = name_c
		direSheet['C%d' % (i+1)] = name_e
		direSheet['D%d' % (i+1)] = male
		direSheet['E%d' % (i+1)] = native

	except:
		print("Director %d is failed." % (i+1))
		failedID.append(i+1)

# 保存excel
direExcel.save('导演数据.xlsx')

# 报结果
if len(failedID) == 0:
	print('ALL SUCCESS!')
else:
	print('Failed:', end='')
	for i in failedID:
		print(' ' + str(i), end='')