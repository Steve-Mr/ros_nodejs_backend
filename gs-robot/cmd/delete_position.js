const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

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

  console.log("map_name = " + map_name + " position_name = " + position_name);
  res.status(200);
  res.json(
    {
      "data": "",
      "errorCode": "",
      "msg": "successed",
      "successed": true
    })
});
module.exports = app