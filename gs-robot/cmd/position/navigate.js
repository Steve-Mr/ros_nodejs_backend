const express = require('express')
const { now } = require('moment')
const rosnodejs = require('rosnodejs')
const router = express.Router()

router.get('/position/navigate', (req, res) => {
    console.log('position navigate')

    new Promise(function (resolve, reject) {
        rosnodejs.initNode('navigation_node', { onTheFly: true }).then(() => {
            const nh = rosnodejs.nh;
            const move_base_msgs = rosnodejs.require('move_base_msgs')

            const geometry_msgs = rosnodejs.require('geometry_msgs')

            // const goal = new geometry_msgs.msg.PoseStamped();
            const goal = new move_base_msgs.msg.MoveBaseActionGoal();
            /**
             * {
                header:
                     { seq: 0, stamp: { secs: 0, nsecs: 0 }, frame_id: '' },
                goal_id:  { stamp: { secs: 0, nsecs: 0 }, id: '' },
                goal:
                    { target_pose: { header: [Message], pose: [Message] } } }
             */

            // const time = require('Time')

            console.log("======")
            console.log(goal)
            console.log("======")

            goal.goal.target_pose.header.frame_id = 'map';
            goal.goal.target_pose.pose.position.x = 11;
            goal.goal.target_pose.pose.position.y = 27;
            goal.goal.target_pose.pose.orientation.w = 1;
            const ac = new rosnodejs.SimpleActionClient({
                nh,
                type: 'move_base_msgs/MoveBase',
                // 虽然不知道为什么，但是在处理过程中 rosnodejs 会自动在 type 结尾添加 ActionGoal
                actionServer: '/move_base'
            })
            ac.waitForServer()
                .then(() => {
                    console.log('connected');
                    console.log(goal)
                    ac.sendGoal(goal.goal)
                })
        })
    })

    // new Promise(function (resolve, reject) {
    //     rosnodejs.initNode('/navigate_to').then(() => {
    //         const nh = rosnodejs.nh;
    //         const pub = nh.advertise(
    //             '/move_base_simple/goal',
    //             'geometry_msgs/PoseStamped');


    //         const geometry_msgs = rosnodejs.require('geometry_msgs')

    //         const goal = new geometry_msgs.msg.PoseStamped();

    //         goal.header.stamp = now;
    //         goal.header.frame_id = 'map';
    //         goal.pose.position.x = 15;
    //         goal.pose.position.y = 25;
    //         goal.pose.position.z = 0;
    //         goal.pose.orientation.w = 1



    //         pub.publish(goal)
    //         console.log(goal)
    //     })
    // })
    // .then(function(){
    //     console.log("finished")
    // })
})

module.exports = router