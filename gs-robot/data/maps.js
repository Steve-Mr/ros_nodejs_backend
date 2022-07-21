#!/usr/bin/env node

const express = require('express');
const yaml = require('js-yaml');
const fs = require('fs')
const mysql = require('mysql')
const sizeOf = require('image-size')

const router = express.Router();

router.get('/maps', (req, res) => {
    let message = new Array();
    let jsonObj = {};
    jsonObj["data"] = [];

    // 通过createPool方法连接服务器
    const db = mysql.createPool({
        host: '127.0.0.1', // 表示连接某个服务器上的mysql数据库
        user: 'root', // 数据库的用户名 （默认为root）
        password: '123456', // 数据库的密码 (默认为root)
        database: 'robot',// 创建的本地数据库名称
    })

    db.query('select * from map_info', (err, data) => {
        if (err) {
            jsonObj["data"] = "{}";
            jsonObj["errorCode"] = "";
            jsonObj["msg"] = "failed";
            jsonObj["successed"] = false;
            return console.log(err.message); // 连接失败
        }
        if (data.length === 0) {
            jsonObj["data"] = "{}";
            jsonObj["errorCode"] = "";
            jsonObj["msg"] = "successed";
            jsonObj["successed"] = true;
            return console.log('数据为空'); // 数据长度为0 则没有获取到数据
        }
        let result = JSON.parse(JSON.stringify(data));
        for (let index in result) {
            const doc = yaml.load(fs.readFileSync(__dirname + '/maps/' + result[index].map_name + ".yaml"))
            const dimensions = sizeOf(__dirname + '/maps/' + result[index].map_name + ".png");

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
            // jsonObj["data"].push(jsonData)
        }
        jsonObj["data"] = message;
        jsonObj["errorCode"] = "";
        jsonObj["msg"] = "successed";
        jsonObj["successed"] = true;
        res.send(JSON.stringify(jsonObj));
    })

})

module.exports = router
