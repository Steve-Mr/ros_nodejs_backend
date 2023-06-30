/**
 * 1.5.1 导航到导航点
 * 
 * GET 请求 /gs-robot/cmd/position/navigate?map_name=?&position_name=?
 * 
 * 根据 map_name 和 position_name 确认坐标点
 */
const express = require('express')
const router = express.Router()
const util = require('../../util')
const rclcontext = require('../../util').getRclContext
const rclnodejs = require('rclnodejs')
const e = require('express')
const NavigateToPose = rclnodejs.require("nav2_msgs/action/NavigateToPose")
const PoseStamped = rclnodejs.require("geometry_msgs/msg/PoseStamped");

const STATE_NONE = 0;
const STATE_NAVIGATING = 1;
const STATE_CANCELLED = 2;
const STATE_PAUSED = 3;
const STATE_ERROR = 4;
const STATE_FINISHED = 5;

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
    }

    async sendGoal(goal) {
        this._node.getLogger().info('Waiting for action server...');
        await this._actionClient.waitForServer();

        this._node.getLogger().info('Sending goal request...');

        const goalHandle = await this._actionClient.sendGoal(goal, (feedback) =>
            this.feedbackCallback(feedback)
        );
        this._goalHandle = goalHandle;

        if (!goalHandle.isAccepted()) {
            this._node.getLogger().info('Goal rejected');
            return STATE_ERROR;
        }

        this._node.getLogger().info('Goal accepted');

        if (goalHandle.isSucceeded()) {
            return STATE_FINISHED
        } else {
            if (goalHandle.isCanceled()) {
                return STATE_CANCELLED
            }
            if (goalHandle.isAborted()) {
                return STATE_ERROR
            }
        }
    }

    feedbackCallback(feedbackMessage) {
        this._node
            .getLogger()
            .info(`Received feedback: ${feedbackMessage}`);
    }

    async cancelGoal() {
        this._node.getLogger().info('Canceling goal');
        const response = await this._goalHandle.cancelGoal();

        if (response.goals_canceling.length > 0) {
            this._node.getLogger().info('Goal successfully canceled');
            return true
        } else {
            this._node.getLogger().info('Goal failed to cancel');
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
        case STATE_FINISHED:
            state.code = "SUCCEDED"
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

        const pose = new PoseStamped();
        pose.header.frame_id = 'map';
        pose.pose.position.x = -2;
        pose.pose.position.y = -2;
        pose.pose.position.z = 0;
        pose.pose.orientation.w = 1;

        goalMsg.pose = pose;

        updateState(STATE_NAVIGATING);
        client.sendGoal(goalMsg).then((result) => {
            console.log(result)
            updateState(result)
            res.json(state.code)
            updateState(STATE_NONE)
        });

    })

    router.get('/cancel_navigate', (req, res) => {
        // 有正在导航任务才能取消任务
        if (state.currentState == STATE_NAVIGATING) {
            // 设置 navigate 状态码，可在 navigate 返回的 json 中显示

            client.cancelGoal().then((result) => {
                console.log(result)
                if(result){
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
            client.cancelGoal().then((result) => {
                if(result){
                    updateState(STATE_PAUSED)
                    res.json(util.successed_json)
                }else{
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
                res.json(state.code)
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