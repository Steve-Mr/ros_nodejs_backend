const express = require('express')
const cors = require('cors')

const util = require('../util')

const app = express();
app.options('*', cors())
app.use(cors())

// curl -X POST -H "Content-Type: application/json" -d '{"data":"this is a test"}' "http://localhost:8080/gs-robot/cmd/pub_topic?topic=chatter&message_type=std_msgs__String"
app.post('/pub_topic', (req, res) => {
    if(typeof(req.query.topic) == undefined || typeof(req.query.message_type) == undefined){
        res.json(util.error_json);
        return;
    }
    console.log(req.query.message_type)
    let topic = req.query.topic;
    let type = req.query.message_type.replace('__', "/");
    console.log(req.body)

    let content = JSON.stringify(req.body);

    // console.log(JSON.parse(content))
    

    const rosnodejs = require('rosnodejs')

    rosnodejs.initNode('/navigation_node').then(() => {
        const nh = rosnodejs.nh;
        let pub = nh.advertise(topic, type, {
            queueSize: 1,
            latching: true,
            throttleMs: 9
        })
        pub.publish(req.body);
        nh.
        res.json(util.successed_json)
    })
})

module.exports = app