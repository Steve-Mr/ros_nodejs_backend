/**
 * 用于获取小车运行状态
 * 
 */

 const express = require('express');
 const router = express.Router();
 
 /**
  * get: 中间件适用的 HTTP 方法
  * function(req. res, next): 中间件函数，这里代码中使用了 lambda 表达式简写
  *      req: HTTP 请求自变量
  *      res: HTTP 响应自变量
  *      next: 中间件函数的回调自变量
  * 以上 req, res, next 名称均为通常约定名称。
 */
 router.get('/amcl_pose', (req, res) => {
 
   const rosnodejs = require('rosnodejs');
   const correct = JSON.parse('{"errorCode":"","msg":"successed","successed":true}');
   let message;
 
   /**
    * Promise 对象用于表示一个异步操作的最终完成（或失败）及其结果值
    * 创建的 Promise 最终将以以解决（resolved）或拒绝状态（rejected）结束
    * 并在完成时调用相应的回调函数（传递给 then 或 catch）
   */
   let p = new Promise(function (resolve, reject) {
     // 创建名字为 navigation_node 的节点，可能有同一时间只能有一个节点的限制（不确定）
     rosnodejs.initNode('/navigation_node').then(() => {
       const nh = rosnodejs.nh;
       /**
        * subscribe(topic, type, callback, options={})
        * @param topic: 订阅话题名称
        * @param type: 订阅话题中消息的类型名
        * @param callback: 获取到消息后的回调函数，下面代码中同样适用了 lambda 表达式简化
        * @param options: 选项对象，下面代码中未使用
        * 
       */
       const sub = nh.subscribe('/amcl_pose', 'geometry_msgs/PoseWithCovarianceStamped', (msg) => {
         // 通过 resolve 将 msg 传递下去
         resolve(msg)
       });
     });
   })
   p.then(function (data) {
    rosnodejs.nh.unsubscribe('/amcl_pose')
     message = {
       "data": JSON.parse(JSON.stringify(data)), "errorCode": "",
       "msg": "successed", "successed": true
     }
     res.send(JSON.stringify(message))
   });
 })
 
 module.exports = router
 