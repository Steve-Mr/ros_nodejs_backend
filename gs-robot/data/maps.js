/**
 * 1.3.8 获取地图列表
 * 
 * GET 请求 ```/gs-robot/data/maps```
 * 
 * 查询 map_info 表中所有数据
 * xxxFileName 字段返回均为空（目前没有使用场景）
 */

const express = require('express');
const yaml = require('js-yaml');
const fs = require('fs')
const sizeOf = require('image-size') // 用来获取地图图片大小

const db = require('../database')
const util = require('../util')

const path = require('path')

const router = express.Router();

router.get('/maps', (req, res) => {
    let message = new Array();

    db.query('select * from map_info', (err, data) => {
        if (err) {
            res.json(util.error_json);

            return console.log(err.message); // 连接失败
        }
        if (data.length === 0) {
            res.json(util.successed_json);
            return console.log('数据为空'); // 数据长度为0 则没有获取到数据
        }
        let result = JSON.parse(JSON.stringify(data));
        for (let index in result) {
            const doc = yaml.load(fs.readFileSync(path.join(util.maps_dir, result[index].map_name + ".yaml")))
            const dimensions = sizeOf(path.join(util.maps_dir, result[index].map_name + ".pgm"));

            let jsonData = {
                "createdAt": "2016-08-11 04:08:30",
                "dataFileName": "40dd8fcd-5e6d-4890-b620-88882d9d3977.data",
                "id": 0,
                "mapInfo": {
                    "gridHeight": dimensions.width,
                    "gridWidth": dimensions.height,
                    "originX": doc.origin[0],
                    "originY": doc.origin[1],
                    "resolution": doc.resolution
                },
                "name": result[index].map_name,
                "obstacleFileName": "",
                "pgmFileName": "",
                "pngFileName": "",
                "yamlFileName": ""
            };
            message.push(jsonData)
        }
        let json = JSON.parse(JSON.stringify(util.successed_json))
        json.data = message
        console.log(json)
        res.json(json);
    })

})

module.exports = router
