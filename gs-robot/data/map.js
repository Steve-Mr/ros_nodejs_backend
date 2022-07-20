#!/usr/bin/env node

const express = require('express');
const router = express.Router();


 router.get('/map', (req, res) => {
var message=new Array();
 // 导入mysql
const mysql = require('mysql')

// 通过createPool方法连接服务器
const db = mysql.createPool({
    host: '127.0.0.1', // 表示连接某个服务器上的mysql数据库
    user: 'root', // 数据库的用户名 （默认为root）
    password: '123456', // 数据库的密码 (默认为root)
    database: 'robot',// 创建的本地数据库名称
})
    db.query('select * from map_info', (err, data) => {
        if (err) return console.log(err.message); // 连接失败
        if (data.length === 0) return console.log('数据为空'); // 数据长度为0 则没有获取到数据
        var result = JSON.parse(JSON.stringify(data));
        for (let index in result) {
        let json1={
            "createdAt":"2016-08-11 04:08:30",
            "dataFileName":"40dd8fcd-5e6d-4890-b620-88882d9d3977.data",
            "id":0,
            "mapInfo":{
                "gridHeight":992, 
                "gridWidth":992, 
                "originX":-24.8, 
                "originY":-24.8,  
                "resolution":0.05000000074505806 
            },
            "name":result[index].map_name,
            "obstacleFileName":"",
            "pgmFileName":"6a3e7cae-c4a8-4583-9a5d-08682344647a.pgm",
            "pngFileName":"228b335f-8c1a-4f05-a292-160f942cbe00.png",
            "yamlFileName":"4108be8c-4004-4ad6-a9c5-599b4a3d49df.yaml"
        };
        message.push(json1)
        }
        res.send(JSON.stringify(message));

    }) 
 })
 
module.exports=router
