const express = require('express')
const util = require('../util')
const fs = require('fs')

const router = express.Router()

router.get('/load_map', (req, res) => {
    if(typeof req.map_name == 'undefined'){
        res.json(util.error_json);
        return;
    }
    let map_name = req.map_name;

    let map_server = rosNode.advertise('/map', 'nav_msgs/OccupancyGrid', {
        queueSize: 1,
        latching: true
    })
    fs.readFile(
        path.join(util.maps_dir, map_name, "pgm"),
        'utf-8',
        (err, data) => {
            if(err){
                res.json(util.error_json);
                return console.log(err.message);
            }
            map_server.publish(data)
        }
    )
    
})