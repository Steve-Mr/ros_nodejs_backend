/**
 * 用于获取小车运行状态
 * 
 */

 const express = require('express');
 const router = express.Router();

 router.get('/position', (req, res) => {
 
   const rosnodejs = require('rosnodejs');
   const correct = JSON.parse('{"errorCode":"","msg":"successed","successed":true}');
   let message;

   let p = new Promise(function (resolve, reject) {
     // 创建名字为 navigation_node 的节点，可能有同一时间只能有一个节点的限制（不确定）
     rosnodejs.initNode('/navigation_node').then(() => {
       const nh = rosnodejs.nh;

       const sub = nh.subscribe('/tf', 'tf/tfMessage', (msg) => {
        // let msg_string = JSON.stringify(msg)
        if(JSON.stringify(msg).includes('"child_frame_id":"base_footprint"')){
             // 通过 resolve 将 msg 传递下去
         resolve(msg)
        }
         // 通过 resolve 将 msg 传递下去
        //  resolve(msg)
       });
     });
   })
   p.then(function (data) {

    let msg = {
      "angle":-173.41528128678252,
      "gridPosition":{
          "x":372,
          "y":502
      },
      "mapInfo":{
          "gridHeight":992,
          "gridWidth":992,
          "originX":-24.8,
          "originY":-24.8,
          "resolution":0.05000000074505806
      },
      "worldPosition":{
          "orientation":{
              "w":-0.05743089347363588,
              "x":0,
              "y":0,
              "z":0.9983494841361015
          },
          "position":{
              "x":-6.189813393986145,
              "y":0.3017086724551712,
              "z":0
          }
      }
  }

  msg.gridPosition.x = data.transforms.translation.x;
  msg.gridPosition.y = data.transforms.translation.y;

     message = {
       "data": JSON.parse(JSON.stringify(data)), "errorCode": "",
       "msg": "successed", "successed": true
     }
     res.send(msg)
   });
 })
 
 module.exports = router
 