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


app.post('/add_position', (req, res) => {
  let position_name = req.query.position_name;
  let type = req.query.type;

  console.log("position_name = " + position_name + " type = " + type);
  console.log(req.body)
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