/**
 * 1.3.7 获取地图图片 png
 * 
 * GET 请求　/gs-robot/data/map_png?map_name=?
 * 
 * 返回 /gs-robot/data/maps 中的对应地图 png（代码中使用了相对地址）
 * 
 */

const express = require('express');
const router = express.Router();

router.get('/map_png', async function(req, res){
    let map_name = req.query.map_name;

    let path = require('path');
    res.sendFile(path.resolve(__dirname, './maps/' + map_name + '.png'));
});
 
module.exports=router
