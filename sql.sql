-- CREATE TABLE user (
--     uid INT NOT NULL AUTO_INCREMENT,
--     name VARCHAR(100),
--     username VARCHAR(45), 
--     password CHAR(32),
--     PRIMARY KEY (uid)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- insert into user value(1, '老大', 'pilipala6868', 'hz19971023');


-- CREATE TABLE movie (
--     movie_id INT NOT NULL AUTO_INCREMENT,
--     name_ch VARCHAR(60) NOT NULL,
--     name_en VARCHAR(60),
--     category VARCHAR(20) NOT NULL,
--     country VARCHAR(20) NOT NULL,
--     intro VARCHAR(600) NOT NULL,
--     released VARCHAR(10) NOT NULL,
--     director_id INT NOT NULL, 
--     actor1_id INT NOT NULL, 
--     actor2_id INT, 
--     actor3_id INT, 
--     poster CHAR(20),
--     PRIMARY KEY (movie_id)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- insert into movie value(1, '布达佩斯大饭店', 'The Grand Budapest Hotel', '冒险', '英国', 
-- 	'故事要从一位无名作家（裘德·洛 Jude Law 饰）说起，为了专心创作，他来到了名为“布达佩斯”的饭店，在这里，作家遇见了饭店的主人穆斯塔法（F·莫里·亚伯拉罕 F. Murray Abraham 饰），穆斯塔法邀请作家共进晚餐，席间，他向作家讲述了这座饱经风雨的大饭店的前世今生。', 
-- 	'2014', 1, 1, 2, null, '1.jpg');


-- CREATE TABLE director (
--     director_id INT NOT NULL AUTO_INCREMENT,
--     name_ch VARCHAR(60) NOT NULL,
--     name_en VARCHAR(60),
--     sex VARCHAR(2) NOT NULL,
--     native VARCHAR(20) NOT NULL,
--     PRIMARY KEY (director_id)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- insert into director value(1, '韦斯·安德森', 'Wes Anderson', 'male', '美国');


-- CREATE TABLE actor (
--     actor_id INT NOT NULL AUTO_INCREMENT,
--     name_ch VARCHAR(60) NOT NULL,
--     name_en VARCHAR(60),
--     sex VARCHAR(2) NOT NULL,
--     native VARCHAR(20) NOT NULL,
--     PRIMARY KEY (actor_id)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- insert into actor value(1, '拉尔夫·费因斯', 'Ralph Fiennes', 'male', '英国');


-- CREATE TABLE record (
--     record_id INT NOT NULL AUTO_INCREMENT,
--     movie_id INT NOT NULL,
--     watched DATE NOT NULL,
--     place VARCHAR(10) NOT NULL,
--     talk VARCHAR(200),
--     score INT NOT NULL,
--     PRIMARY KEY (record_id)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- insert into record value(1, 1, '2017-10-02', '宿舍', null, '7.5');

