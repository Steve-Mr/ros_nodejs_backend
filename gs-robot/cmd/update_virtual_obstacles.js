const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express();

app.options('*', cors())
app.use(cors())

app.post('/update_virtual_obstacles', (req, res) => {
    let map_name = req.query.map_name;
    let obstacle_name = req.query.obstacle_name;
    console.log("map name: " + map_name + " obstacle name: " + obstacle_name);

    fs.writeFile(
        path.join(__dirname, '..', 'data', 'obstacles',map_name),
        JSON.stringify(req.body, null, 3),
        {flag: 'w+'}, 
        err => {
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