const express = require('express')
const cors = require('cors')

const app = express();

app.options('*', cors())
app.use(cors())

app.post('/update_virtual_obstacles', (req, res) => {
    let map_name = req.query.map_name;
    let obstacle_name = req.query.obstacle_name;
    console.log("map name: " + map_name + " obstacle name: " + obstacle_name);
    console.log(req.body);
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