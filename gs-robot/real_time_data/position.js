/**
 * 用于获取小车运行状态
 * 
 */
'use strict';

const express = require('express');
const router = express.Router();
const cors = require('cors');
const util = require('../util')
const rclnodejs = require('rclnodejs')
const rclcontext = require('../util').getRclContext

const app = express();
app.options('*', cors())
app.use(cors())

app.get('/position', (req, res) => {

  const correct = JSON.parse('{"errorCode":"","msg":"successed","successed":true}');
  let message;

  //Todo: add global map info and get map info first

  rclcontext.then(() => {
    console.log('started')
    const node = new rclnodejs.Node('position_subscriber');
    const subscriber = node.createSubscription(
      'tf2_msgs/msg/TFMessage', '/tf', {},
      (result) => {
        console.log("got message")
        if (JSON.stringify(result).includes('"child_frame_id":"base_footprint"')) {
          node.destroySubscription(subscriber)
          console.log(result)
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
          const mapInfoNode = new rclnodejs.Node('map_subscriber');

          let qos_map = new rclnodejs.QoS
          qos_map.depth = 10
          qos_map.history = rclnodejs.QoS.HistoryPolicy.RMW_QOS_POLICY_HISTORY_SYSTEM_DEFAULT
          qos_map.durability = rclnodejs.QoS.DurabilityPolicy.RMW_QOS_POLICY_DURABILITY_TRANSIENT_LOCAL
          qos_map.reliability = rclnodejs.QoS.ReliabilityPolicy.RMW_QOS_POLICY_RELIABILITY_RELIABLE

          const subscriber_map = mapInfoNode.createSubscription(
            'nav_msgs/msg/OccupancyGrid',
            'map', {qos: qos_map},
            (map) => {
              console.log(map.info)
              mapInfoNode.destroySubscription(subscriber_map);
              msg.mapInfo.gridHeight = map.info.height;
              msg.mapInfo.gridWidth = map.info.width;
              msg.mapInfo.originX = map.info.origin.position.x;
              msg.mapInfo.originY = map.info.origin.position.y;
              msg.mapInfo.resolution = map.info.resolution;

              mapInfoNode.destroy();
              res.json(msg);
            }
          )
          mapInfoNode.spin();
        node.destroy()
          // res.json(msg);
        }
      }
    )

    node.spin();
  })
})

module.exports = app
