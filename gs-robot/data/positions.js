const express = require('express')
const database = require('../database')
const moment = require('moment')

const router = express.Router();

router.get('/positions', (req, res) => {
    let map_name = req.query.map_name
    let type = req.query.type ? req.query.type : 9999
    let sql, params;
    if (type === 9999) {
        sql = 'SELECT * FROM points_list WHERE map_name = ?';
        params = [map_name];
    } else {
        sql = 'SELECT * FROM points_list WHERE map_name = ? AND type = ?';
        params = [map_name, type];
    }

    database.query(sql, params, (err, data) => {
        if (err) {
            res.json({
                "data": "{}",
                "errorCode": "",
                "msg": "failed",
                "successed": false
            });
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
        res.json({
            "data": points_data,
            "errorCode": "",
            "msg": "successed",
            "successed": true
        });
    })
})

function formatDate(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  }

module.exports = router
