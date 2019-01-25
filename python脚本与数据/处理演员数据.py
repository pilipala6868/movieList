#! pyton3
# 根据豆瓣ID爬取豆瓣信息

import re, os, requests, openpyxl, bs4

# # 提取电影excel中演员豆瓣id
# infoExcel = openpyxl.load_workbook('电影数据.xlsx')
# infoSheetNames = infoExcel.sheetnames
# infoSheet = infoExcel[infoSheetNames[0]]

# totalRow = infoSheet.max_row
# allActor = []

# for i in range(totalRow):
# 	for j in ['H', 'I', 'J']:
# 		temp = infoSheet['%s%d' % (j, i+1)].value
# 		if temp == None:
# 			continue
# 		if temp not in allActor:
# 			allActor.append(temp)
# 			infoSheet['%s%d' % (j, i+1)] = len(allActor)
# 		else:
# 			infoSheet['%s%d' % (j, i+1)] = allActor.index(temp) + 1

# # 写入演员数据
# actExcel = openpyxl.load_workbook('演员数据.xlsx')
# actSheetNames = actExcel.sheetnames
# actSheet = actExcel[actSheetNames[0]]

# for i in range(len(allActor)):
# 	rowContent = [i+1, allActor[i]]
# 	actSheet.append(rowContent)

# # 保存excel
# infoExcel.save('电影数据.xlsx')
# actExcel.save('演员数据.xlsx')


url = 'https://movie.douban.com/celebrity/'

# 获取excel中演员豆瓣id
actExcel = openpyxl.load_workbook('演员数据.xlsx')
actSheetNames = actExcel.sheetnames
actSheet = actExcel[actSheetNames[0]]

actTotalRow = actSheet.max_row

failedID = []
# 逐个访问豆瓣
for i in range(246, actTotalRow):
	try:
		actID = actSheet['B%d' % (i+1)].value
		# 打开链接
		print('Getting url %d...' % (i+1))
		res = requests.get(url + str(actID))
		res.raise_for_status()
		soup = bs4.BeautifulSoup(res.text, "html.parser")

		# 获取信息
		name = soup.select('#wrapper #content h1')[0]
		name_c, name_e = name.getText().split(' ', 1)
		otherInfo = soup.select('#wrapper #headline .info ul li')
		try:
			male = otherInfo[0].getText().split()[-1]
		except:
			male = ''
		try:
			native = otherInfo[3].getText().replace(' ', '').replace('\n', '').split(',')[0][4:]
		except:
			native = ''

		# 写入excel
		actSheet['B%d' % (i+1)] = name_c
		actSheet['C%d' % (i+1)] = name_e
		actSheet['D%d' % (i+1)] = male
		actSheet['E%d' % (i+1)] = native

	except:
		print("Actor %d is failed." % (i+1))
		failedID.append(i+1)

	break

# 保存excel
actExcel.save('演员数据.xlsx')

# 报结果
if len(failedID) == 0:
	print('ALL SUCCESS!')
else:
	print('Failed:', end='')
	for i in failedID:
		print(' ' + str(i), end='')