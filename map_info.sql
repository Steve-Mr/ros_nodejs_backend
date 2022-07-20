CREATE DATABASE robot;
CREATE TABLE IF NOT EXISTS map_info(
    id INT UNSIGNED AUTO_INCREMENT,
    sort INT NOT NULL,
    car_code INT NOT NULL,
    map_name VARCHAR(20) NOT NULL,
    path_name VARCHAR(50),
    update_time VARCHAR(15),
    updator VARCHAR(10),
    PRIMARY KEY (id)
);

INSERT INTO map_info VALUES (1, 1, 1, 'map_1', 'path_1', '2022-07-20', 'user0');
INSERT INTO map_info VALUES (2, 2, 2, 'map_2', 'path_2', '2022-07-20', 'user0');