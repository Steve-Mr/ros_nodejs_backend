/**
 * 1.9.1 获取虚拟墙数据
 * 
 * GET 请求 /gs-robot/data/virtual_obstacles?map_name=?
 * 
 * response
 * {
    "data": {
        "carpets":{},       // 地毯
        "carpetsWorld":{},
        "decelerations":{}, // 减速
        "decelerationsWorld":{}, 
        "displays":{},
        "displaysWorld":{},
        "highlight":{},     // 计划用作上坡
        "highlightWorld":{},
        "obstacles":{},     // 障碍物
        "obstaclesWorld":{},
        "slopes":{},        // 下坡
        "slopesWorld":{},
    },
    "errorCode": "",
    "msg": "successed",
    "successed": true
  }

  目前不考虑 xxxWorld 数据的记录和返回（均为空值）

  具体每个类型中包含的 json 对象

  {
    "circles": [],    # 包含格式为 {x, y, r} （r 为半径）的坐标列表
    "lines": [],      # 包含数个 json array（即 []），每个 array 中包含起点和终点坐标 {x, y}
    "polygons": [],   # 包含数个 json array，每个 array 中包含数个顶点 {x, y}
    "polylines": [],  # 包含数个 json array，每个 array 中包含数个顶点 {x, y}
    "rectangles": []  # 包含数个 json array, 每个 array 中包含一条斜对角线上两个顶点坐标 {x, y}。
                      客户端在根据这两个点确定一个方形时认为方形的长和宽均平行于坐标轴/地图图片的长和宽。              
  }
 */
const express = require('express')
const fs = require('fs')
const path = require('path')
const util = require('../util')

const router = express.Router();

router.get('/virtual_obstacles', (req, res) => {
  if(!req.query.map_name) {
    res.json(util.error_json)
    return 
  }
    let map_name = req.query.map_name;
    console.log(path.join(__dirname, 'obstacles', map_name));
    fs.readFile(
        path.join(__dirname, 'obstacles', map_name),
        'utf-8',
        (err, data) => {
            if (err) {
                res.json(util.error_json);
                return console.log(err.message);
              }
              res.status(200);
              let objs = "";
              if(data){
                objs = data
              }
              let json = JSON.parse(JSON.stringify(util.successed_json))
              json.data = JSON.parse(objs)
              res.json(json)
        }
    )
})

module.exports = router;
