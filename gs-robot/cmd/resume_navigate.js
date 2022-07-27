const express = require('express')
const rosnodejs = require('rosnodejs')
const router = express.Router()
const util = require('../util')
const navigate = require('./position/navigate')

router.get('/resume_navigate', (req, res) => {
    if (Object.keys(navigate.pos).length) {
        let pos = navigate.pos;
        rosnodejs.initNode('navigation_node', { onTheFly: true }).then(() => {
            const nh = rosnodejs.nh;
            const ac = new rosnodejs.SimpleActionClient({
                nh,
                type: 'move_base_msgs/MoveBase',
                // 虽然不知道为什么，但是在处理过程中 rosnodejs 会自动在 type 结尾添加 ActionGoal
                actionServer: '/move_base'
            })

            const move_base_msgs = rosnodejs.require('move_base_msgs')


            const message = new move_base_msgs.msg.MoveBaseActionGoal();

            message.goal.target_pose.header.frame_id = 'map';
            message.goal.target_pose.pose.position.x = pos.x;
            message.goal.target_pose.pose.position.y = pos.y;
            message.goal.target_pose.pose.orientation.w = 1;

            ac.waitForServer()
                    .then(() => {
                        console.log('connected');
                        console.log(message)
                        ac.sendGoalAndWait(message.goal, util.timeout(util.default_timeout), util.timeout(util.default_timeout))
                            .then(() => {
                                if (ac.getState() === 'SUCCEEDED') {
                                    pos = {};
                                    navigate.clearPos();
                                    res.json(util.successed_json)
                                } else {
                                    res.json(util.error_json)
                                }
                            })
                    })
        })

    }else{
        res.json(util.error_json)
    }

})

module.exports = router