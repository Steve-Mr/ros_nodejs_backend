/**
 * 用于获取小车运行状态
 * 
 */

 const express = require('express');
 const router = express.Router();
//  const util = require('../util')
console.log("pre amcl pose")

 const rclnodejs = require('rclnodejs');
 const rclcontext = require('../util').getRclContext;
 console.log('starting amcl pose')
 
 /**
  * get: 中间件适用的 HTTP 方法
  * function(req. res, next): 中间件函数，这里代码中使用了 lambda 表达式简写
  *      req: HTTP 请求自变量
  *      res: HTTP 响应自变量
  *      next: 中间件函数的回调自变量
  * 以上 req, res, next 名称均为通常约定名称。
 */
 router.get('/amcl_pose', (req, res) => {
 
   const correct = JSON.parse('{"errorCode":"","msg":"successed","successed":true}');
   let message;
 
   /**
    * Promise 对象用于表示一个异步操作的最终完成（或失败）及其结果值
    * 创建的 Promise 最终将以以解决（resolved）或拒绝状态（rejected）结束
    * 并在完成时调用相应的回调函数（传递给 then 或 catch）
   */
   let p = new Promise(function (resolve, reject) {

    console.log("started")

    rclcontext
    .then(() => {
      const node = new rclnodejs.Node('subscriber_example');
      console.log("starting subscriber")

      const subscriber = node.createSubscription(
        'geometry_msgs/msg/PoseWithCovarianceStamped',
        'amcl_pose',{},
        (pose) => {
          console.log("logging")
          console.log(pose)
          node.destroySubscription(subscriber)
          node.destroy()
          resolve(pose)
        })

        console.log("waiting")

        node.spin();
    }) 

   })
   p.then(function (data) {
     message = {
       "data": JSON.parse(JSON.stringify(data)), "errorCode": "",
       "msg": "successed", "successed": true
     }
     res.send(JSON.stringify(message))
   });
 })
 
 module.exports = router
 