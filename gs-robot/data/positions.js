/**
 * 1.2.14 地图点数据
 * 
 * GET请求　/gs-robot/data/positions?map_name=?&type=?
 * 
 * type参数不传，默认返回所有点，传type则返回该类型的点
 * 
 * 目前没有对世界坐标系（worldPose）进行处理
 */
const express = require('express')
const database = require('../database')
const moment = require('moment')
const util = require('../util')

const router = express.Router();

router.get('/positions', (req, res) => {
    let map_name = req.query.map_name
    // 若没有传入 type 值则 type 值为 9999
    let type = req.query.type ? req.query.type : 9999
    let sql, params;
    // type 值 9999 则返回所有类型的点
    if (type === 9999) {
        sql = 'SELECT * FROM points_list WHERE map_name = ?';
        params = [map_name];
    } else {
        sql = 'SELECT * FROM points_list WHERE map_name = ? AND type = ?';
        params = [map_name, type];
    }

    database.query(sql, params, (err, data) => {
        if (err) {
            res.json(util.error_json);
            return console.log(err.message);
        }
        let points_data = []
        if (data) {
            for (point of data) {
                console.log(point.createdAt.toString());
                points_data.push({
                    "angle": point.angle,
                    "createdAt": formatDate(point.createdAt),
                    "gridX": point.gridX,
                    "gridY": point.gridY,
                    "id": point.id,
                    "mapId": point.map_id,
                    "mapName": point.map_name,
                    "name": point.name,
                    "type": point.type,
                    "worldPose": {
                        "orientation": {
                            "w": 0,
                            "x": 0,
                            "y": 0,
                            "z": 0
                        },
                        "position": {
                            "x": 0,
                            "y": 0,
                            "z": 0
                        }
                    }
                })
            }
        }
        let response_json = util.successed_json
        response_json.data = points_data
        res.json(response_json);
    })
})

function formatDate(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  }

module.exports = router
