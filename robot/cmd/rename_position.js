/**
 * 重命名点
 * 
 * GET 请求　/robot/cmd/rename_position?map_name=?&origin_name=?&new_name=?
 */
const express = require('express')
const cors = require('cors')

const database = require('../database')
const util = require('../util');

const app = express();

app.options('*', cors())
app.use(cors())

app.get('/rename_position', (req, res) => {

    let map_name, origin_name, new_name;

    if (typeof req.query.map_name != 'undefined' &&
        typeof req.query.origin_name != 'undefined' &&
        typeof req.query.new_name != 'undefined' ){ // 是否包含了参数
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

module.exports = app

