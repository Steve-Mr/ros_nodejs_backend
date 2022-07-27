const express = require('express')
const rosnodejs = require('rosnodejs')
const router = express.Router()
const util = require('../util')
const navigate = require('./position/navigate')

router.get('/cancel_navigate', (req, res) => {
    rosnodejs.initNode('navigation_node', { onTheFly: true }).then(() => {
        const nh = rosnodejs.nh;
        const ac = new rosnodejs.SimpleActionClient({
            nh,
            type: 'move_base_msgs/MoveBase',
            // 虽然不知道为什么，但是在处理过程中 rosnodejs 会自动在 type 结尾添加 ActionGoal
            actionServer: '/move_base'
        })
        navigate.state.code = "CANCELED"
        ac.waitForServer()
        .then(() => {
            ac.cancelAllGoals()
            navigate.clearPos();
            navigate.isCanceled = true;
            res.json(util.successed_json)
        })
    })
})

module.exports = router