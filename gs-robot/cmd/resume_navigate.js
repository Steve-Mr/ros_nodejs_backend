/**
 * 1.5.4.恢复导航
 * 
 * GET 请求 /gs-robot/cmd/resume_navigate 
 * */ 
const express = require('express')
const rosnodejs = require('rosnodejs')
const router = express.Router()

const util = require('../util')
// 这里需要使用 navigate 中的目标坐标，如果 navigate 中的导航任务中断，此坐标信息将会被保留
const navigate = require('./position/navigate')

router.get('/resume_navigate', (req, res) => {
    // navigate.pos 默认为 {} 即空对象，其非空时则可以恢复导航
    if (Object.keys(navigate.pos).length) {
        let pos = navigate.pos;

        // 这一部分与 navigate.js 中基本一致
        rosnodejs.initNode(util.node_name, { onTheFly: true }).then(() => {
            const nh = rosnodejs.nh;
            // 关于 SimapleActionClient 的说明请查看 /cmd/position/navigate.js 文件为中注释
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
                            .catch((err) => {
                                let msg = JSON.parse(JSON.stringify(util.error_json));
                                msg.errorCode = err
                                res.json(msg)
                            })
                    })
        })

    }else{
        res.json(util.error_json)
    }

})

module.exports = router