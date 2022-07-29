/**
 * 1.5.5 取消导航
 * 
 * GET 请求　/gs-robot/cmd/cancel_navigate
 */
const express = require('express')
const rosnodejs = require('rosnodejs')
const router = express.Router()

const util = require('../util')
const navigate = require('./position/navigate')

router.get('/cancel_navigate', (req, res) => {
    // 有正在导航任务才能取消任务
    if (Object.keys(navigate.pos).length) {
        rosnodejs.initNode('navigation_node', { onTheFly: true }).then(() => {
            const nh = rosnodejs.nh;
            const ac = new rosnodejs.SimpleActionClient({
                nh,
                type: 'move_base_msgs/MoveBase',
                // 虽然不知道为什么，但是在处理过程中 rosnodejs 会自动在 type 结尾添加 ActionGoal
                actionServer: '/move_base'
            })
            // 设置 navigate 状态码，可在 navigate 返回的 json 中显示
            navigate.state.code = "CANCELED"
            ac.waitForServer()
                .then(() => {
                    ac.cancelAllGoals()
                    // 取消了导航，则清除原本的目标坐标
                    navigate.clearPos();
                    navigate.isCanceled = true;
                    res.json(util.successed_json)
                })
        })
    } else {
        res.json(util.error_json)
    }
})

module.exports = router