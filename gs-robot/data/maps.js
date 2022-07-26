#!/usr/bin/env node

const express = require('express');
const yaml = require('js-yaml');
const fs = require('fs')
const sizeOf = require('image-size')

const db = require('../database')

const router = express.Router();

router.get('/maps', (req, res) => {
    let message = new Array();

    db.query('select * from map_info', (err, data) => {
        if (err) {
            res.json({
                "data": "{}",
                "errorCode": "",
                "msg": "failed",
                "successed": false
            });

            return console.log(err.message); // 连接失败
        }
        if (data.length === 0) {
            res.json({
                "data": "",
                "errorCode": "",
                "msg": "successed",
                "successed": true
              });
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
        }
        res.json({
            "data": message,
            "errorCode": "",
            "msg": "successed",
            "successed": true
          });
    })

})

module.exports = router
