/**
 * 记录点
 * 
 * POST 请求　/robot/cmd/add_position?position_name=?&type=?
 * 
 */
const express = require('express')
const bodyParser = require('body-parser')
/**
 * 跨源资源共享，用来避免错误
 * "Cross-Origin Request Blocked: 
 * The Same Origin Policy disallows reading the remote resource at $somesite"
 * 关于此错误更多信息可以参考：
 * https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS/Errors
 * cors 包相关内容参考
 * https://expressjs.com/en/resources/middleware/cors.html
 */
const cors = require('cors')

const database = require('../database')
const util = require('../util')

const app = express();

// 支持 [CORS 预检请求](https://developer.mozilla.org/zh-CN/docs/Glossary/Preflight_request)
app.options('*', cors())
// 启用 cors
app.use(cors())

// bodyparser: 针对 post 请求的请求体进行解析
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.get('/add_position', (req, res) => {
  let position_name = req.query.position_name;
  let type = req.query.type;

  if(!position_name || !type) return res.json(util.error_json)

  let query_sql = 'SELECT * FROM points_list WHERE name = ? AND type = ?';
  new Promise(function(resolve, reject){
    database.query(query_sql, [position_name, type], (err, data) => {
      if(err || data.length === 0){
        reject('no point')
      }
      resolve(data)
    })
  }).then(function(data){
    console.log(data)
    // 这里应该有一些『记录点』的操作
    res.json(util.successed_json)
  }).catch((err)=>{
    console.log(err)
    res.json(util.error_json)
  })
})

app.post('/add_position', (req, res) => {
  let position_name = req.query.position_name;
  let type = req.query.type;

  console.log("position_name = " + position_name + " type = " + type);
  console.log(req.body)

  let point = req.body;
  let query_sql = 'SELECT id FROM map_info WHERE map_name = ?';
  let insert_sql = 'INSERT INTO points_list SET ?';
  new Promise(function (resolve, reject) {

    // 首先根据请求体中的 map_name 查询对应的地图 id
    database.query(query_sql, [point.mapName], (err, data) => {
      if (err || data.length === 0) {
        // res.json(util.error_json);
        reject("no map")
        // return console.log("no map");
      }
      resolve(data)
    })
  }).then(function (data) {
    let values = ({
      angle: point.angle,
      gridX: point.gridX,
      gridY: point.gridY,
      map_id: parseInt(data[0].id),
      map_name: point.mapName,
      name: point.name,
      type: point.type
    })
    // 查询到对应 map_id 则将数据插入到对应表中
    let query = database.query(insert_sql, values, (err, data) => {
      console.log(query.sql)
      if (err) {
        reject(err)
        // res.json(util.error_json);
        // return console.log(err.message);
      }
      res.status(200);
      res.json(util.successed_json)
    })
  })
  .catch((err)=>{
    res.json(util.error_json)
    console.log(err)
  })

});

module.exports = app