const express = require('express')
const rosnodejs = require('rosnodejs')
const router = express.Router()
const database = require('../../database')
const util = require('../../util')

const pos = {}

router.get('/position/navigate', (req, res) => {
    let map_name, position_name;

    if (typeof req.query.map_name != 'undefined' &&
        typeof req.query.position_name != undefined &&  // 是否包含了参数
        req.query.map_name && req.query.position_name) { // 参数是否有值
        map_name = req.query.map_name;
        position_name = req.query.position_name;
    } else {
        res.json(util.error_json)
        return;
    }

    new Promise(function (resolve, reject) {

        let query_sql = "SELECT * FROM points_list WHERE name = ? AND map_name = ?"

        database.query(query_sql, [position_name, map_name], (err, data) => {
            if (err) {
                res.json(util.error_json);
                return console.log(err.message)
            }
            resolve(data)
        })
    })
        .then(function (data) {

            rosnodejs.initNode('navigation_node', { onTheFly: true }).then(() => {
                const nh = rosnodejs.nh;
                const move_base_msgs = rosnodejs.require('move_base_msgs')


                const message = new move_base_msgs.msg.MoveBaseActionGoal();
                /**
                 * {header:     
                 *      {seq: 0, stamp: {secs: 0, nsecs: 0 }, frame_id: '' },
                    goal_id:    
                        {stamp: {secs: 0, nsecs: 0 }, id: '' },
                    goal:
                        {target_pose: { header: 
                                            {seq: 0, stamp: { secs: 0, nsecs: 0 }, frame_id: '' }, 
                                        pose: 
                                            {position: { x: 0, y: 0, z: 0 },
                                            orientation:{ x: 0, y: 0, z: 0, w: 0 } } } }
                    MoveBaseActionGoal 消息的格式，这里只使用到 goal 部分。
                 */

                message.goal.target_pose.header.frame_id = 'map';
                message.goal.target_pose.pose.position.x = 20//data[0].gridX;
                message.goal.target_pose.pose.position.y = 24//data[0].gridY;
                message.goal.target_pose.pose.orientation.w = 1;

                pos.x = 20//data[0].gridX;
                pos.y = 24//data[0].gridY;
                

                const ac = new rosnodejs.SimpleActionClient({
                    nh,
                    type: 'move_base_msgs/MoveBase',
                    // 虽然不知道为什么，但是在处理过程中 rosnodejs 会自动在 type 结尾添加 ActionGoal
                    actionServer: '/move_base'
                })
                ac.waitForServer()
                    .then(() => {
                        console.log('connected');
                        console.log(message)
                        ac.sendGoalAndWait(message.goal, util.timeout(util.default_timeout), util.timeout(util.default_timeout))
                            .then(() => {
                                if (ac.getState() === 'SUCCEEDED') {
                                    delete pos.x;
                                    delete pos.y;
                                    res.json(util.successed_json)
                                } else {
                                    res.json(util.error_json)
                                }
                            })
                    })
            })
        })
})

function clearPos(){
    if(Object.keys(pos).length){
        delete pos.x;
        delete pos.y;
    }

}
module.exports = {
    router,
    pos: pos,
    clearPos: clearPos
}