#! pyton3
# 根据豆瓣ID爬取豆瓣信息

import re, os, requests, openpyxl

url = 'http://api.douban.com/v2/movie/subject/'

# 获取所有豆瓣ID
f = open('电影记录.txt', 'r', encoding='utf-8')

doubanID = []
for i in f.readlines():
	doubanID.append(i.split(', ')[-2].strip('\''))
f.close()

# 先打开excel
infoExcel = openpyxl.load_workbook('电影.xlsx')
infoSheetNames = infoExcel.sheetnames
infoSheet = infoExcel[infoSheetNames[0]]

# 逐个ID访问
failedID = []
for i in range(len(doubanID)):
	try:
		# 网站请求
		req = requests.get(url + doubanID[i])
		info = req.json()
		print("Requesting No.%d " % (i+1), end='')

		# 获取各个信息
		name_c = info['title']
		name_e = info['original_title']
		category = info['genres']
		country = info['countries']
		intro = info['summary']
		released = info['year']
		director = info['directors'][0]['id']
		actor1 = info['casts'][0]['id']
		actor2 = info['casts'][1]['id']
		actor3 = info['casts'][2]['id']
		print(name_c)

		# 处理特殊列表值
		if type(category) == list:
			temp = category
			category = ''
			for t in temp:
				category += t + ' '
			category = category.strip()
		if type(country) == list:
			temp = country
			country = ''
			for t in temp:
				country += t + ' '
			country = country.strip()

		# 写入excel
		row = [name_c, name_e, category, country, intro, released, director, actor1, actor2, actor3]
		infoSheet.append(row)
		print('Excel write in success.')

		# 海报下载
		imgUrl = info['images']['small']
		ir = requests.get(imgUrl)
		if ir.status_code == 200:
			with open('img/poster/%d.jpg' % (i+1), 'wb') as f:
				for chunk in ir:
					f.write(chunk)
			print('Poster download success.')
		else:
			print("Poster %d download failed." % (i+1))

	except Exception as e:
		print(str(e))
		print("Movie %d is failed." % (i+1))
		failedID.append(i+1)

	# if i >= 5:
	# 	break

# 保存excel
infoExcel.save('电影.xlsx')

# 报结果
if len(failedID) == 0:
	print('ALL SUCCESS!')
else:
	print('Failed:', end='')
	for i in failedID:
		print(' ' + str(i), end='')