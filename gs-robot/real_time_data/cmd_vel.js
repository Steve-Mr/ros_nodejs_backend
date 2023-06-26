/**
 * 用于获取小车运行状态
 * 
 */

const express = require('express');
const router = express.Router();
const rclcontext = require('../util').getRclContext
const rclnodejs = require('rclnodejs')

/**
 * get: 中间件适用的 HTTP 方法
 * /cmd_vel: 中间件适用的路径
 * function(req. res, next): 中间件函数，这里代码中使用了 lambda 表达式简写
 *      req: HTTP 请求自变量
 *      res: HTTP 响应自变量
 *      next: 中间件函数的回调自变量
 * 以上 req, res, next 名称均为通常约定名称。
*/
router.get('/cmd_vel', (req, res) => {

  rclcontext.then(() => {
    const node = new rclnodejs.Node('cmd_vel_subscriber');
    const cmdSubscription = node.createSubscription(
      'geometry_msgs/msg/Twist', 'cmd_vel', {},
      (result) => {
        node.destroySubscription(cmdSubscription)
        node.destroy()
        let message = {
          "data": JSON.parse(JSON.stringify(result)), "errorCode": "",
          "msg": "successed", "successed": true
        }
        res.json(message)
      }
    )
    node.spin()
  })
})

module.exports = router
