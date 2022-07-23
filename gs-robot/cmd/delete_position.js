const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const database = require('../database')

const app = express();


app.options('*', cors())
app.use(cors())

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());


app.get('/delete_position', (req, res) => {
    let map_name = req.query.map_name;
  let position_name = req.query.position_name;

  let delete_sql = "DELETE FROM points_list WHERE map_name = ? AND name = ?"

  let query = database.query(delete_sql, [map_name, position_name], (err, data) => {
    console.log(query.sql)
    if (err) {
      res.json({
        "data": "{}",
        "errorCode": "",
        "msg": "failed",
        "successed": false
      });
      return console.log(err.message);
    }
    res.status(200);
    res.json(
      {
        "data": "",
        "errorCode": "",
        "msg": "successed",
        "successed": true
      })
  })
});
module.exports = app