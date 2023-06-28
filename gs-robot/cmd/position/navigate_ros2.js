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
            return;
        }

        this._node.getLogger().info('Goal accepted');

        const result = await goalHandle.getResult();

        if (goalHandle.isSucceeded()) {
            this._node
                .getLogger()
                .info(`Goal suceeded with result: ${result.result}`);
            rclnodejs.shutdown();
            return 1
        } else {
            this._node.getLogger().info(`Goal failed with status: ${status}`);
            return 0
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
        } else {
            this._node.getLogger().info('Goal failed to cancel');
        }

        rclnodejs.shutdown();
    }
}

// 用来保存目标点坐标，在到达目标点/导航取消时清空内容，因此也可以作为导航是否完成的标志
const pos = {}
// 在无法达到目标时的错误状态，默认 UNKNOWN，被暂停则为 PAUSED，被取消则为 CANCELED
const state = { code: "UNKNOWN" }



router.get('/position/navigate', (req, res) => {

    const pose = new PoseStamped();
    pose.header.frame_id = 'map';
    pose.pose.position.x = -5;
    pose.pose.position.y = -5;
    pose.pose.position.z = 0;
    pose.pose.orientation.w = 1;

    const goalMsg = new NavigateToPose.Goal()
    goalMsg.pose = pose;

    rclcontext.then(() => {
        const node = new rclnodejs.Node('navigate_to_pose_client_node');
        const client = new MoveBaseActionClient(node);
        client.sendGoal(goalMsg).then((result) => {
            res.json(result)
        });
        node.spin()
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