/**
 * 1.5.1 导航到导航点
 * 
 * GET 请求 /gs-robot/cmd/position/navigate?map_name=?&position_name=?
 * 
 * 根据 map_name 和 position_name 确认坐标点
 */
const express = require('express')
const router = express.Router()
const database = require('../../database')
const util = require('../../util')
const rclcontext = require('../../util').getRclContext
const rclnodejs = require('rclnodejs')
const NavigateToPose = rclnodejs.require("nav2_msgs/action/NavigateToPose")
const PoseStamped = rclnodejs.require("geometry_msgs/msg/PoseStamped");

const STATE_NONE = 0;
const STATE_NAVIGATING = 1;
const STATE_CANCELLED = 2;
const STATE_PAUSED = 3;
const STATE_ERROR = 4;
const STATE_SUCCEEDED = 5;

// 在无法达到目标时的错误状态，默认 UNKNOWN，被暂停则为 PAUSED，被取消则为 CANCELED
const state = {
    currentState: STATE_NONE,
    code: "UNKNOWN"
}

class MoveBaseActionClient {
    constructor(node) {
        this._node = node;

        this._actionClient = new rclnodejs.ActionClient(
            node,
            'nav2_msgs/action/NavigateToPose',
            '/navigate_to_pose'
        );

        this.goalPaused = false;
    }

    async sendGoal(goal) {
        this._node.getLogger().info('Waiting for action server...');
        await this._actionClient.waitForServer();

        this._node.getLogger().info('Sending goal request...');

        try {
            const goalHandle = await this._actionClient.sendGoal(goal);
            this._goalHandle = goalHandle;

            if (!goalHandle.isAccepted()) {
                this._node.getLogger().info('Goal rejected');
                return STATE_ERROR;
            }

            this._node.getLogger().info('Goal accepted');

            // Wait for the goal to be completed or canceled
            const result = await goalHandle.getResult();

            // Check the final status of the goal
            if (goalHandle.isSucceeded()) {
                return STATE_SUCCEEDED
            } else {
                if (goalHandle.isCanceled()) {
                    if (this.goalPaused) {
                        this.goalPaused = false
                        return STATE_PAUSED
                    } else {
                        return STATE_CANCELLED
                    }
                }
                if (goalHandle.isAborted()) {
                    return STATE_ERROR
                }
            }
        } catch (error) {
            // Handle possible exceptions
            this._node.getLogger().error(error.message);
            return STATE_ERROR;
        }
    }

    async cancelGoal(paused = false) {
        this._node.getLogger().info('Canceling goal');
        this.goalPaused = paused
        const response = await this._goalHandle.cancelGoal();

        if (response.goals_canceling.length > 0) {
            this._node.getLogger().info('Goal successfully canceled');
            return true
        } else {
            this._node.getLogger().info('Goal failed to cancel');
            this.goalPaused = false
            return false
        }
    }
}


function updateState(newState) {
    state.currentState = newState
    switch (newState) {
        case STATE_NONE:
        case STATE_NAVIGATING:
            state.code = "UNKNOWN";
            break;
        case STATE_SUCCEEDED:
            state.code = "SUCCEEDED"
            break;
        case STATE_CANCELLED:
            state.code = "CANCELLED";
            break;
        case STATE_PAUSED:
            state.code = "PAUSED";
            break;
        case STATE_ERROR:
            state.code = "ERROR";
            break;
    }

}

const goalMsg = new NavigateToPose.Goal()

rclcontext.then(() => {
    const node = new rclnodejs.Node('navigate_to_pose_client_node');
    const client = new MoveBaseActionClient(node);

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
                if (err || data.length === 0) {
                    res.json(util.error_json);
                    reject("cannot get position info")
                }
                resolve(data)
            })
        }).then(function (data) {

            const pose = new PoseStamped();
            pose.header.frame_id = 'map';
            pose.pose.position.x = data[0].gridX;
            pose.pose.position.y = data[0].gridY;
            pose.pose.position.z = 0;
            pose.pose.orientation.w = 1;

            goalMsg.pose = pose;

            updateState(STATE_NAVIGATING);
            client.sendGoal(goalMsg).then((result) => {
                console.log(result)
                updateState(result)
                if (result === STATE_SUCCEEDED) {
                    res.json(util.successed_json)
                } else {
                    let msg = JSON.parse(JSON.stringify(util.error_json));
                    msg.errorCode = state.code;
                    res.json(msg)
                }
                updateState(STATE_NONE)
            });

        }).catch((err) => {
            console.log(err)
            res.json(util.error_json)
        }).catch((err) => {
            console.log(err)
        })
    })

    router.get('/cancel_navigate', (req, res) => {
        // 有正在导航任务才能取消任务
        if (state.currentState == STATE_NAVIGATING) {
            // 设置 navigate 状态码，可在 navigate 返回的 json 中显示

            client.cancelGoal().then((result) => {
                console.log(result)
                if (result) {
                    updateState(STATE_CANCELLED)
                    res.json(util.successed_json)
                } else {
                    res.json(util.error_json)
                }
            }).catch((err) => {
                console.log(err)
            })
        } else {
            res.json(util.error_json)
        }
    })

    router.get('/pause_navigate', (_req, res) => {
        // 正在有导航任务才能暂停
        if (state.currentState == STATE_NAVIGATING) {
            client.cancelGoal(true).then((result) => {
                if (result) {
                    updateState(STATE_PAUSED)
                    res.json(util.successed_json)
                } else {
                    res.json(util.error_json)
                }
            }).catch((error) => {
                res.json(util.error_json)
            })
        } else {
            res.json(util.error_json)
        }
    })

    router.get('/resume_navigate', (req, res) => {
        // navigate.pos 默认为 {} 即空对象，其非空时则可以恢复导航
        if (state.currentState = STATE_PAUSED) {
            updateState(STATE_NAVIGATING);
            client.sendGoal(goalMsg).then((result) => {
                console.log(result)
                updateState(result)
                if (result === STATE_SUCCEEDED) {
                    res.json(util.successed_json)
                } else {
                    let msg = JSON.parse(JSON.stringify(util.error_json));
                    msg.errorCode = state.code;
                    res.json(msg)
                }
                updateState(STATE_NONE)
            });
        } else {
            res.json(util.error_json)
        }
    })

    node.spin()
})

module.exports = {
    router,
    state: state
}