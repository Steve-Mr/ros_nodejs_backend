/**
 * 用于获取小车运行状态
 * 
 */

const express = require('express');
const router = express.Router();
const cors = require('cors');
const util = require('../util')

const app = express();
app.options('*', cors())
app.use(cors())

app.get('/position', (req, res) => {

  const rosnodejs = require('rosnodejs');
  const correct = JSON.parse('{"errorCode":"","msg":"successed","successed":true}');
  let message;

  let p = new Promise(function (resolve, reject) {
    util.init_connection(util.node_name);
    // 创建名字为 navigation_node 的节点，可能有同一时间只能有一个节点的限制（不确定）
    rosnodejs.initNode(util.node_name).then(() => {
      const nh = rosnodejs.nh;

      nh.subscribe(util.topic_tf, util.message_tf, (result) => {
        // let msg_string = JSON.stringify(msg)
        if (JSON.stringify(result).includes('"child_frame_id":"base_footprint"')) {
          let msg = {
            "angle": -173.41528128678252,
            "gridPosition": {
              "x": 372,
              "y": 502
            },
            "mapInfo": {
              "gridHeight": 992,
              "gridWidth": 992,
              "originX": -24.8,
              "originY": -24.8,
              "resolution": 0.05000000074505806
            },
            "worldPosition": {
              "orientation": {
                "w": -0.05743089347363588,
                "x": 0,
                "y": 0,
                "z": 0.9983494841361015
              },
              "position": {
                "x": -6.189813393986145,
                "y": 0.3017086724551712,
                "z": 0
              }
            }
          }

          let q0 = result.transforms[0].transform.rotation.w;
          let q1 = result.transforms[0].transform.rotation.x;
          let q2 = result.transforms[0].transform.rotation.y;
          let q3 = result.transforms[0].transform.rotation.z;
          let yaw = Math.atan2(2.0 * (q3 * q0 + q1 * q2), - 1.0 + 2.0 * (q0 * q0 + q1 * q1));

          msg.gridPosition.x = result.transforms[0].transform.translation.x;
          msg.gridPosition.y = result.transforms[0].transform.translation.y;
          msg.angle = yaw;
          resolve(msg)
        }
      });
    });
  }).then(function (data) {

    new Promise(function (resolve, reject) {
      const nh = rosnodejs.nh;
      nh.unsubscribe(util.topic_tf)
      nh.subscribe(util.topic_map_metadata, util.message_map_metadata, (result) => {
        data.mapInfo.gridHeight = result.height;
        data.mapInfo.gridWidth = result.width;
        data.mapInfo.originX = result.origin.position.x;
        data.mapInfo.originY = result.origin.position.y;
        data.mapInfo.resolution = result.resolution;
        resolve(data);
      });

    }).then(function (data) {
      new Promise(function (resolve, reject) {
        const nh = rosnodejs.nh;
        nh.unsubscribe(util.topic_map_metadata);
        nh.subscribe(util.topic_odom, util.message_odom, (result) => {
          // {queueSize:1}, 
          data.worldPosition = result.pose.pose;
          // console.log(data)
          resolve(data)
        })

      }).then(function (data) {
        const nh = rosnodejs.nh;
        nh.unsubscribe(util.topic_odom)
        res.json(data);
      }).catch(err => console.err(err))
    }).catch(err => console.err(err))
  }).catch(err => {
    console.err(err);
  })
})

module.exports = app
