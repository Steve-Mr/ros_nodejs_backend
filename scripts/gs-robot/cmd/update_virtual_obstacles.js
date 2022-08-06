/**
 * 1.9.2 添加或更新虚拟墙数据
 * 
 * 虚拟墙数据全部传过来，全部更新一遍，不管是新添加还是更新某个虚拟墙
 * 
 * POST 请求 /gs-robot/cmd/update_virtual_obstacles?map_name=?&obstacle_name=?
 * 
 * 请求体同获取虚拟墙返回 data 字段
 */
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const util = require('../util')

const app = express();

app.options('*', cors())
app.use(cors())

app.post('/update_virtual_obstacles', (req, res) => {
    let map_name = req.query.map_name;
    let obstacle_name = req.query.obstacle_name;
    console.log("map name: " + map_name + " obstacle name: " + obstacle_name);

    fs.writeFile(
        path.join(__dirname, '..', 'data', 'obstacles',map_name),
        JSON.stringify(req.body),
        {flag: 'w+'}, 
        err => {
            if (err) {
                res.json(util.error_json);
                return console.log(err.message);
              }
              res.status(200);
              res.json(util.successed_json)
        })
});

module.exports = app