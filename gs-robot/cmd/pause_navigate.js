/**
 * 1.5.3 暂停导航
 * 
 * GET 请求　/gs-robot/cmd/pause_navigate
 * 
 */
const express = require('express')
const rosnodejs = require('rosnodejs')
const router = express.Router()
const util = require('../util')
const navigate = require('./position/navigate')

router.get('/pause_navigate', (req, res) => {
    // 正在有导航任务才能暂停
    if (Object.keys(navigate.pos).length) {
        rosnodejs.initNode(util.node_name, { onTheFly: true }).then(() => {
            const nh = rosnodejs.nh;
            // 关于 SimapleActionClient 的说明请查看 /cmd/position/navigate.js 文件为中注释
            const ac = new rosnodejs.SimpleActionClient({
                nh,
                type: 'move_base_msgs/MoveBase',
                // 虽然不知道为什么，但是在处理过程中 rosnodejs 会自动在 type 结尾添加 ActionGoal
                actionServer: '/move_base'
            })

            // 设置 navigate 中的状态码为 PAUSED，navigate 的返回信息中会显示此状态码
            ac.waitForServer()
                .then(() => {
                    navigate.state.code = "PAUSED"
                    ac.cancelAllGoals()
                    res.json(util.successed_json)
                })
                .catch((error) => {
                    res.json(util.error_json)
                })
        })
    } else {
        res.json(util.error_json)
    }
})

module.exports = router