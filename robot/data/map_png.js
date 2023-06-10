/**
 * 获取地图图片 png
 * 
 * GET 请求　/robot/data/map_png?map_name=?
 * 
 * 返回 /robot/data/maps 中的对应地图 png（代码中使用了相对地址）
 * 
 */

const express = require('express');
const router = express.Router();
let path = require('path');

const pgmjs = require('pgmjs')
const util = require('../util')
const fs = require('fs')

router.get('/map_png', async function(req, res){
    let map_name = req.query.map_name;

    pgmjs.readPgm(path.join(util.maps_dir, map_name + '.pgm')).then((pgmdata) => {
        pgmjs.writePngFromPgm(pgmdata, path.join(util.maps_dir, map_name + '.png')).then((err) => {
            if (err) {
                console.log(err)
                res.json(util.error_json)
            }
            res.sendFile(path.join(util.maps_dir, map_name + '.png'), (err) => {
                if(err){
                    console.log(err)
                }
                fs.unlinkSync(path.join(util.maps_dir, map_name + ".png"))
            })
        })
    }).catch((err) => {
        console.log(err)
    })

    // res.sendFile(path.resolve(__dirname, './maps/' + map_name + '.png'));
});
 
module.exports=router
