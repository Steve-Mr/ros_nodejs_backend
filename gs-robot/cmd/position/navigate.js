/**
 * 1.5.1 导航到导航点
 * 
 * GET 请求 /gs-robot/cmd/position/navigate?map_name=?&position_name=?
 * 
 * 根据 map_name 和 position_name 确认坐标点
 */
const express = require('express')
const rosnodejs = require('rosnodejs')
const router = express.Router()
const database = require('../../database')
const util = require('../../util')

// 用来保存目标点坐标，在到达目标点/导航取消时清空内容，因此也可以作为导航是否完成的标志
const pos = {}
// 在无法达到目标时的错误状态，默认 UNKNOWN，被暂停则为 PAUSED，被取消则为 CANCELED
const state = { code: "UNKNOWN" }

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

        // 第一步确认请求点存在并获取点信息
        let query_sql = "SELECT * FROM points_list WHERE name = ? AND map_name = ?"

        database.query(query_sql, [position_name, map_name], (err, data) => {
            if (err) {
                res.json(util.error_json);
                return console.log(err.message)
            }
            resolve(data)
        })
    }).then(function (data) {

        // 根据点的信息设定 MoveBaseActionGoal，即导航的目标点
        // 这里整体的思路参照 http://wiki.ros.org/navigation/Tutorials/SendingSimpleGoals 中的内容
        rosnodejs.initNode('navigation_node', { onTheFly: true }).then(() => {
            const nh = rosnodejs.nh;

            const move_base_msgs = rosnodejs.require('move_base_msgs')
            const message = new move_base_msgs.msg.MoveBaseActionGoal();
            /**
             * MoveBaseActionGoal 消息的格式。
             * 根据 rosnodejs 对于 MoveBaseActionGoal 的处理
             * （https://github.com/RethinkRobotics-opensource/rosnodejs/blob/devel/src/actions/ActionClient.js 86行）
             * 这里只使用到 goal 部分，其余部分会由 rosnodejs 进行处理
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
             */

            message.goal.target_pose.header.frame_id = 'map';
            message.goal.target_pose.pose.position.x = data[0].gridX;
            message.goal.target_pose.pose.position.y = data[0].gridY;
            message.goal.target_pose.pose.orientation.w = 1;

            pos.x = data[0].gridX;
            pos.y = data[0].gridY;

            const ac = new rosnodejs.SimpleActionClient({
                nh,
                // action 类型
                // 在处理过程中 rosnodejs 会自动在 type 结尾添加 ActionGoal
                type: 'move_base_msgs/MoveBase',
                actionServer: '/move_base'
            })

            // 等待连接到 ActionServer
            ac.waitForServer()
                .then(() => {
                    console.log('connected');
                    console.log(message)

                    /**
                     * sendGoalAndWait(goal, execTimeout, preemptTimeout)
                     * 
                     * 将目标发送到 ActionServer，直到目标完成或超时
                     * 
                     * @param goal: 目标位置
                     * @param execTimeout: 导航超时时间，若被 preempt 中断转到 preemptTimeout
                     * @param preemptTimeout: 被 preempt 中断后的超时时间
                     * 
                     * preempt 应指被其他程序打断/抢占的情况，导航会中断进入等待状态
                     * 
                     * 这里理解可能有偏差故附上 ros 中参数和 PREEMPTED 的定义
                     * 
                     * 	goal 	The goal to be sent to the ActionServer
	                 *  execute_timeout 	Time to wait until a preempt is sent. 0 implies wait forever
	                 *  preempt_timeout 	Time to wait after a preempt is sent. 0 implies wait forever
                     * 
                     * PREEMPTED - the action is inactive, but was commanded to deactivate by an external client.  
                     */
                    ac.sendGoalAndWait(message.goal, util.timeout(util.default_timeout), util.timeout(util.default_timeout))
                        .then(() => {
                            // 导航任务结束，通过 getState() 查询状态来确定任务完成或超时
                            if (ac.getState() === 'SUCCEEDED') {
                                delete pos.x;
                                delete pos.y;
                                res.json(util.successed_json)
                            } else {
                                let msg = JSON.parse(JSON.stringify(util.error_json));
                                msg.errorCode = state.code;
                                // 如果任务在暂停之外的状态退出，清空 pos
                                if(state.code!=='PAUSED'){
                                    clearPos()
                                }
                                state.code = 'UNKNOWN'
                                res.json(msg)
                                return
                            }
                        })
                })
        })
    })
})

// 清除 pos 内容，用于外部调用
function clearPos() {
    if (Object.keys(pos).length) {
        delete pos.x;
        delete pos.y;
    }
}

module.exports = {
    router,
    pos: pos,
    clearPos: clearPos,
    state: state
}