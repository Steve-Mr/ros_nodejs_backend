const express = require('express')
const database = require('../database')
const util = require('../util');

const router = express.Router();

router.get('/rename_position', (req, res) => {

    let map_name, origin_name, new_name;

    if (typeof req.query.map_name != 'undefined' &&
        typeof req.query.origin_name != 'undefined' &&
        typeof req.query.new_name != 'undefined' && // 是否包含了参数
        req.query.map_name && req.query.origin_name &&
        req.query.new_name) { // 参数是否有值
        map_name = req.query.map_name;
        origin_name = req.query.origin_name;
        new_name = req.query.new_name;

    } else {
        res.json(util.error_json)
        return;
    }

    let update_sql = 'UPDATE points_list SET name = ? WHERE name = ? AND map_name = ?';
    database.query(update_sql, [new_name, origin_name, map_name], (err, data) => {
        if(err){
            res.json(util.error_json)
            return console.log(err.message)
        }
        res.json(util.successed_json)
    })
})

module.exports = router;

