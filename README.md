# Ros NodeJS Backend

## 初始化项目

### 安装 Nodejs 和 npm

Ubuntu: ```sudo apt install nodejs npm```  

不同的发行版可能需要使用不同的命令，详情请参阅各发行版仓库或 Node.js [下载页](https://nodejs.org/zh-cn/download/)。

### 创建 ROS 功能包

在 ROS 工作环境中创建功能包用作 Node.js 服务器，名称不限。  

```shell
cd <path-to-your-workspace>/src
catkin_create_pkg apiserver
```

#### 配置环境

在前面创建的包中初始化 npm。  

```shell
cd <path-to-your-workspace>/src/apiserver
npm init -y
```  

安装运行项目需要的 npm 包。  

```shell
npm install rosnodejs
npm install express
npm install mysql
npm install js-yaml
npm install image-size
npm install cors
npm install moment
```

关于 rosnodejs 的更多信息，请查看其[官方仓库](https://github.com/RethinkRobotics-opensource/rosnodejs)。  

### 克隆项目

在前面创建的功能包中创建 scripts 文件夹 ```mkdir scripts && cd $_```。  

克隆仓库 ```git clone https://github.com/Steve-Mr/ros_nodejs_backend.git .```
或复制文件到 scripts 文件夹中。  
(克隆命令中末尾的 "." 符号是必要的，表示克隆到当前目录。)  

## 测试可用性

注意：由于目前使用的模拟环境，不同环境下细节配置可能不同，在运行之前可能需要根据当前环境进行调整。  

1. 配置并运行机器人。  

2. 运行服务器。  
    
    在 scripts 文件夹下运行 ```node server.js``` 。  
    
    这里的测试将会订阅 /cmd_vel 话题，该话题包含机器人运行中的实时数据，可根据具体情况对话题名称进行修改，如有的项目中该话题为 /robot_base_velocity_controller/cmd_vel，修改位置在 ```scripts/gs-robot/real_time_data/cmd_vel.js``` 中。  

3. 通过 GET 请求访问数据。  
    
    浏览器访问 ```localhost:8080/gs-robot/real_time_data/cmd_vel``` 。  

    预期结果如下  

    ```json
    {"data":{"linear":{"x":0,"y":0,"z":0},"angular":{"x":0,"y":0,"z":0}},"errorCode":"","msg":"successed","successed":true}
    ```

## 数据库

这里使用 mysql，建立名为 robot 的数据库，下面给出数据库中表的描述。   

### 地图信息 map_info:
```
+-------------+--------------+------+-----+---------+----------------+
| Field       | Type         | Null | Key | Default | Extra          |
+-------------+--------------+------+-----+---------+----------------+
| id          | int unsigned | NO   | PRI | NULL    | auto_increment |
| sort        | int          | NO   |     | NULL    |                |
| car_code    | int          | NO   |     | NULL    |                |
| map_name    | varchar(20)  | NO   | UNI | NULL    |                |
| path_name   | varchar(50)  | YES  |     | NULL    |                |
| update_time | varchar(15)  | YES  |     | NULL    |                |
| updator     | varchar(10)  | YES  |     | NULL    |                |
+-------------+--------------+------+-----+---------+----------------+
```
sort：顺序号  
car_code：无人车编号  
path_name：路线名称，由用户填写  
updator：更新人  

### 已标记点列表 points_list
```
+-----------+--------------+------+-----+-------------------+-------------------+
| Field     | Type         | Null | Key | Default           | Extra             |
+-----------+--------------+------+-----+-------------------+-------------------+
| id        | int unsigned | NO   | MUL | NULL              | auto_increment    |
| angle     | float        | NO   |     | NULL              |                   |
| createdAt | datetime     | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| gridX     | int          | NO   |     | NULL              |                   |
| gridY     | int          | NO   |     | NULL              |                   |
| map_id    | int unsigned | NO   | MUL | NULL              |                   |
| map_name  | varchar(20)  | NO   |     | NULL              |                   |
| name      | varchar(50)  | NO   | PRI | NULL              |                   |
| type      | int          | NO   |     | NULL              |                   |
+-----------+--------------+------+-----+-------------------+-------------------+
f
```
angle：偏向角  
gridX/gridY：栅格地图上坐标   
map_id：点所在地图 ID，客户端提交的信息中为地图名称，需要在服务端转换为地图 ID 再进行存储。  
name：点的名称  
type：点的类型，参照 API 文档中 1.2.14 地图点数据中类型定义  

## 项目结构

```
├── gs-robot
│   ├── cmd
│   │   ├── add_position.js                     # 添加点
│   │   ├── delete_position.js                  # 删除点
│   │   └── update_virtual_obstacles.js         # 更新障碍物
│   ├── cmd.js                                  # 处理对路径 /gs-grbot/cmd/ 的访问请求
│   ├── data
│   │   ├── map_png.js                          # 根据地图名加载地图 png
│   │   ├── maps                                # 地图文件夹
│   │   │   ├── map_1.png                       # 地图图片 png
│   │   │   ├── map_1.yaml                      # 描述地图的 yaml，与地图同名
│   │   │   └── ...
│   │   ├── maps.js                             # 获取地图列表
│   │   ├── obstacles                           # 障碍物 json 文件夹
│   │   │   └── map_2                           # 一个文件内保存同名地图内障碍物信息（json 格式）
│   │   └── virtual_obstacles.js                # 返回地图对应障碍物信息
│   ├── database.js                             # 用于和数据库连接
│   ├── data.js                                 # 处理对路径 /gs-grbot/data/ 的访问请求
│   ├── others
│   │   ├── task_confirm.js
│   │   └── task_end.js
│   ├── others.js
│   ├── real_time_data
│   │   └── cmd_vel.js                          # 机器人运行信息
│   └── real_time_data.js                       # 处理对路径 /gs-grbot/real_time_data/ 的访问请求
├── README.md
├── robot.sql                                   # 建议数据库命令
└── server.js                                   # 注册服务器，处理对路径 /gs-robot/ 的访问请求
```

## 计划实现 API 列表

- [x] 1.2.14 地图点数据 ```/gs-robot/data/positions?map_name=?&type=?```	
- [x] 1.2.15 记录点	```/gs-robot/cmd/add_position?position_name=?&type=? ```
- [x] 1.2.16 删除点	```/gs-robot/cmd/delete_position?map_name=?&position_name=?```
- [x] 1.2.17 重命名点 ```/gs-robot/cmd/rename_position?map_name=?&origin_name=?&new_name=?```	 
- [ ] 1.3.1  开始扫描地图 ```/gs-robot/cmd/start_scan_map?map_name=?&ype=?```	
- [ ] 1.3.2  结束扫描并保存地图(同步) ```/gs-robot/cmd/start_scan_map?map_name=?&ype=?```	
- [ ] 1.3.3  取消扫描不保存地图 ```/gs-robot/cmd/cancel_scan_map ```
- [ ] 1.3.4  结束扫描保存地图(异步)//推荐使用 ```/gs-robot/cmd/async_stop_scan_map ```	
- [ ] 1.3.5  异步结束扫地图是否完成 ```/gs-robot/cmd/is_stop_scan_finished ```	
- [ ] 1.3.6  获取实时扫地图图片png ```/gs-robot/real_time_data/scan_map_png```	
- [x] 1.3.7  获取地图图片png ```/gs-robot/data/map_png?map_name=?```	
- [x] 1.3.8  获取地图列表 ```/gs-robot/data/maps```	
- [ ] 1.3.13 编辑地图 ```/gs-robot/cmd/edit_map?map_name=?&operation_type=?```	
- [ ] 1.4.1  加载地图 ```/gs-robot/cmd/load_map?map_name=? ```	
- [ ] 1.4.10 获取初始化点列表 ```/gs-robot/data/positions?map_name=?&type=0```	
- [x] 1.5.1  导航到导航点 ```/gs-robot/cmd/position/navigate?map_name=?&position_name=?```	
- [x] 1.5.3  暂停导航 ```/gs-robot/cmd/pause_navigate```	
- [x] 1.5.4  恢复导航 ```/gs-robot/cmd/resume_navigate```	
- [x] 1.5.5  取消导航 ```/gs-robot/cmd/cancel_navigate```	
- [x] 1.9.1  获取虚拟墙数据 ```/gs-robot/data/virtual_obstacles?map_name=?```	
- [x] 1.9.2  添加或更新虚拟墙数据 ```/gs-robot/cmd/update_virtual_obstacles?map_name=?&obstacle_name=?```