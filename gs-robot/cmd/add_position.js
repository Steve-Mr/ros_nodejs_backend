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


app.post('/add_position', (req, res) => {
  let position_name = req.query.position_name;
  let type = req.query.type;

  console.log("position_name = " + position_name + " type = " + type);
  console.log(req.body)

  let point = req.body;
  let insert_sql = 'INSERT INTO points_list SET ?';
  let values = ({
    angle: point.angle,
    gridX: point.gridX,
    gridY: point.gridY,
    map_name: point.mapName,
    name: point.name,
    type: point.type
})

    let query = database.query(insert_sql, values,(err, data) => {
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