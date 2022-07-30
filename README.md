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

### 配置环境

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

- 测试服务器和数据库连接 

    1. 配置数据库

        登录 mysql 创建 robot 数据库、使用该数据库并导入 sql 文件：
        ```sql
        CREATE DATABASE robot;
        USE robot;
        source /path/to/sql/file/robot.sql
        ``` 
        /path/to/sql/file/ 需要根据自己目录位置进行调整，且 /path/to/sql/file/robot.sql 前后不需要添加引号。  

    2. 运行服务器。  
        
        在 scripts 文件夹下运行 ```node server.js``` 。  

    3. 通过 GET 请求访问数据。  

        浏览器访问 ```localhost:8080/gs-robot/data/maps```。  
          
        预期结果：
        ```json
        [{"createdAt":"2016-08-11 04:08:30","dataFileName":"40dd8fcd-5e6d-4890-b620-88882d9d3977.data","id":0,"mapInfo":{"gridHeight":2048,"gridWidth":2048,"originX":-51.224998,"originY":-51.224998,"resolution":0.05},"name":"map_1","obstacleFileName":"","pgmFileName":"","pngFileName":"","yamlFileName":""},{"createdAt":"2016-08-11 04:08:30","dataFileName":"40dd8fcd-5e6d-4890-b620-88882d9d3977.data","id":0,"mapInfo":{"gridHeight":1344,"gridWidth":1152,"originX":-10,"originY":-10,"resolution":0.1},"name":"map_2","obstacleFileName":"","pgmFileName":"","pngFileName":"","yamlFileName":""}]
        ```

- 测试服务器和机器人连接

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

## 数据存储

### 数据库  

这里使用 mysql，建立名为 robot 的数据库，下面给出数据库中表的描述。   

**地图信息 map_info:**
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
- id: 地图 ID
- sort：顺序号  
- car_code：无人车编号  
- map_name: 地图名称，由于 api 中普遍使用 map_name 来标识地图，故此项应为 UNIQUE  
- path_name：路线名称，由用户填写  
- update_time: 更新时间  
- updator：更新人

**已标记点列表 points_list**
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
```
- id: 点 ID
- angle：偏向角
- createdAt: 创建时间，默认为插入数据库时的当前时间    
- gridX/gridY：栅格地图上坐标   
- map_id：点所在地图 ID，客户端提交的信息中为地图名称，需要在服务端转换为地图 ID 再进行存储。 
- map_name: 地图名称  
- name：点的名称  
- type：点的类型，参照 API 文档中 1.2.14 地图点数据中类型定义  

### 文件

1. /gs-robot/data/maps： 存放地图图片（.png）和同名的地图配置文件（.yaml），文件名和 map_info 表中对应项 map_name 字段相同。  
    
    配置文件格式：(目前只使用了 resolution 和 origin 值，更多相关内容参考 [ROS map_server](http://wiki.ros.org/map_server))  

    ```yaml
    image: testmap.png
    resolution: 0.1
    origin: [0.0, 0.0, 0.0]
    occupied_thresh: 0.65
    free_thresh: 0.196
    negate: 0
    ```

    - image: 地图文件路径，绝对路径或相对 YAML 路径
    - resolution: 地图分辨率，米/像素
    - origin: 地图左下角像素的二维位姿(x, y, yaw)，yaw 为偏向角，逆时针方向为正（但许多情况下可能会被忽略）  
    - occupied_thresh: 占用概率大于此与之的像素认为是完全占用
    - free_thresh: 占用概率小于此阈值的像素认为是完全空闲
    - negate: 白/黑 空闲/占用的语义是否应该反转，不影响阈值的解释。


2. /gs-robot/data/obstacles： 存放地图中的虚拟墙信息，文件名和 map_info 表中对应项 map_name 字段相同。  

    内容格式参照 1.9.1 获取虚拟墙数据 中 response 的 data 内容，目前 xxxWrold 项内容均未使用。

## 项目结构

文件的路径参照 API 中路径设置，如 1.3.8  获取地图列表 ```/gs-robot/data/maps```	对应的 js 文件地址为 scritps/gs-robot/data/maps.js。对于 /data /cmd 等目录，在其同级文件目录中有同名的 js 文件负责路由功能，处理对其名称对应 API 的访问。

```bash
.
├── gs-robot
│   ├── cmd
│   │   ├── add_position.js
│   │   ├── cancel_navigate.js
│   │   ├── delete_position.js
│   │   ├── pause_navigate.js
│   │   ├── position
│   │   │   └── navigate.js
│   │   ├── rename_position.js
│   │   ├── resume_navigate.js
│   │   └── update_virtual_obstacles.js
│   ├── cmd.js                              # 处理对路径 /gs-grbot/cmd/ 的访问请求
│   ├── data
│   │   ├── map_png.js
│   │   ├── maps                            # 存储地图图片和 yaml 描述文件
│   │   │   ├── map_1.png
│   │   │   ├── map_1.yaml
│   │   │   ├── ...
│   │   ├── maps.js
│   │   ├── obstacles                       # 存储地图虚拟墙数据
│   │   │   └── map_2                       # 同名地图中虚拟墙数据
│   │   ├── positions.js
│   │   └── virtual_obstacles.js
│   ├── database.js
│   ├── data.js                             # 处理对路径 /gs-grbot/data/ 的访问请求
│   ├── others
│   │   ├── task_confirm.js
│   │   └── task_end.js
│   ├── others.js                           # 处理通信协议部分访问请求
│   ├── real_time_data
│   │   └── cmd_vel.js
│   ├── real_time_data.js                   # 处理对 /gs-grbot/real_time_data/ 的访问请求
│   └── util.js
├── README.md
├── robot.sql                               # 数据库
└── server.js                               # 注册服务器，处理对路径 /gs-robot/ 的访问请求
```

## 计划实现 API 

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
- [x] 1.4.10 获取初始化点列表 ```/gs-robot/data/positions?map_name=?&type=0```	<= 同 1.2.14
- [x] 1.5.1  导航到导航点 ```/gs-robot/cmd/position/navigate?map_name=?&position_name=?```	
- [x] 1.5.3  暂停导航 ```/gs-robot/cmd/pause_navigate```	
- [x] 1.5.4  恢复导航 ```/gs-robot/cmd/resume_navigate```	
- [x] 1.5.5  取消导航 ```/gs-robot/cmd/cancel_navigate```	
- [x] 1.9.1  获取虚拟墙数据 ```/gs-robot/data/virtual_obstacles?map_name=?```	
- [x] 1.9.2  添加或更新虚拟墙数据 ```/gs-robot/cmd/update_virtual_obstacles?map_name=?&obstacle_name=?```

- [x] 小车实时运行数据 ```/gs-robot/real_time_data/cmd_vel```
- [x] 收到任务确认 ```/gs-robot/others/task_confirm```  

备注： 1.2.15 记录点 API 使用了 POST 请求，因此 positon_name 和 type 为可选参数。  

POST 请求需要内容样例如下：  

```json
    {
      "angle":-55,
      "gridX":468,
      "gridY":512,
      "mapId":0,
      "mapName":"office",
      "name":"origin",
      "type":2
    }
```

## 代码示例

参考 [express 指南](https://expressjs.com/zh-cn/guide/routing.html)、[Node.js 文档](https://nodejs.org/docs/latest-v10.x/api/)、[rosnodejs 仓库](https://github.com/RethinkRobotics-opensource/rosnodejs)等。   

**[server.js](server.js)**:  

server.js 是一个 express 路由，表示应用程序端点的定义以及端点响应客户机请求的方式。

```javascript
// 导入依赖
const express = require('express');

// 创建 express实例，即创建 express服务器
const app = express();

// 针对不同请求的不同路由
app.use('/gs-robot', require('./gs-robot/real_time_data'))
app.use('/gs-robot', require('./gs-robot/data'))
app.use('/gs-robot', require('./gs-robot/cmd'))


// 监听 8080 端口
app.listen(8080, function () {
  console.log('服务器已启动')
})
```

**[real_time_data.js](gs-robot/real_time_data.js)**:   

real_time_data.js 在这里承担了次级路由的功能，将访问路由到对应的中间件中。

```javascript
const express = require('express')
const router = express.Router()

router.use('/real_time_data', require('./real_time_data/cmd_vel'));

// CommonJS 规范，被导出内容可以在其他文件中通过 require 方式进行调用
// 可以导出多个参数/方法
module.exports = router
```  

**[cmd_vel.js](gs-robot/real_time_data/cmd_vel.js)**:   

cmd_vel.js 中包含了较为典型的中间件函数，中间件函数能够访问请求对象、响应对象以及应用程序的请求/响应循环中的下一个中间件函数。下一个中间件函数通常由名为 next 的变量来表示，如果当前中间件函数没有结束请求/响应循环，那么它必须调用 next()，以将控制权传递给下一个中间件函数。否则，请求将保持挂起状态。   

中间件函数可以执行以下任务： 

- 执行任何代码。
- 对请求和响应对象进行更改。
- 结束请求/响应循环。
- 调用堆栈中的下一个中间件。

```javascript
const express = require('express');
const router = express.Router();

/**
 * get: 中间件适用的 HTTP 方法
 * /cmd_vel: 中间件适用的路径
 * function(req. res, next): 中间件函数，这里代码中使用了 lambda 表达式简写
 *      req: HTTP 请求自变量
 *      res: HTTP 响应自变量
 *      next: 中间件函数的回调自变量
 * 以上 req, res, next 名称均为通常约定名称。
*/

router.get('/cmd_vel', (req, res) => {

  const rosnodejs = require('rosnodejs');
  const correct = JSON.parse('{"errorCode":"","msg":"successed","successed":true}');
  let message;

  /**
   * Promise 对象用于表示一个异步操作的最终完成（或失败）及其结果值
   * 创建的 Promise 最终将以以解决（resolved）或拒绝状态（rejected）结束
   * 并在完成时调用相应的回调函数（传递给 then 或 catch）
  */
  let p = new Promise(function (resolve, reject) {
    // 创建名字为 my_node 的节点，可能有同一时间只能有一个车节点的限制（不确定）
    rosnodejs.initNode('/my_node').then(() => {
      // 创建 ros nodehandle
      const nh = rosnodejs.nh;
      /**
       * subscribe(topic, type, callback, options={})
       * @param topic: 订阅话题名称
       * @param type: 订阅话题中消息的类型名
       * @param callback: 获取到消息后的回调函数，下面代码中同样适用了 lambda 表达式简化
       * @param options: 选项对象，下面代码中未使用
       * 
      */
      const sub = nh.subscribe('/cmd_vel', 'geometry_msgs/Twist', (msg) => {
        // 通过 resolve 将 msg 传递下去
        resolve(msg)
      });
    });
  })
  p.then(function (data) {
    message = {
      "data": JSON.parse(JSON.stringify(data)), "errorCode": "",
      "msg": "successed", "successed": true
    }
    res.send(JSON.stringify(message))
  });
})

module.exports = router
```