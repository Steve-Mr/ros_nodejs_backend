/**
 * 帮助类，方便一些量的修改和更新
 * 
 * 在调用时使用相对路径即可
 */

console.log('util hello')

// 出错返回
const error_json = {
  "data": "{}",
  "errorCode": "",
  "msg": "failed",
  "successed": false
}
console.log('util 2')


// 成功返回
const successed_json = {
  "data": "",
  "errorCode": "",
  "msg": "successed",
  "successed": true
}
console.log('util 3')


// 返回一个时间对象，用于设置超时计时中
function timeout(seconds) {
  return {
    secs: seconds,
    nsecs: 0
  }
};
console.log('util 4')


// 默认超时时长
const default_timeout = 180;

console.log('util 5')


// 导航中指向的 frame id，需要根据不同情况进行修改
const navigate_frame_id = 'map'

const path = require('path');
// const app = require('./cmd');

const root_dir = __dirname

const maps_dir = path.resolve(path.join(__dirname, "..", '..', '..', 'navigation', 'map'));

console.log('util 6')


function getCoord(point, or, h, r){
  return {
    x: Math.round((point.x - or.x)/r),
    y: Math.round(h - Math.abs(point.y - or.y)/r)
  }
}

console.log('util 7')

const rclnodejs = require('rclnodejs')
let rclcontext = rclnodejs.init();
function getRclContext() {
    console.log("init")
    return rclnodejs.init()
}

console.log('util 8')


module.exports.topic_tf = '/tf';
module.exports.message_tf = 'tf/tfMessage';
module.exports.topic_cmd_vel = '/cmd_vel';
module.exports.message_cmd_vel = 'geometry_msgs/Twist';
module.exports.topic_map_metadata = '/map_metadata';
module.exports.message_map_metadata = 'nav_msgs/MapMetaData';
module.exports.topic_odom = '/odom';
module.exports.message_odom = 'nav_msgs/Odometry';
module.exports.topic_amcl = '/amcl_pose';
module.exports.message_amcl = 'geometry_msgs/PoseWithCovarianceStamped';

module.exports.message_move_base = 'move_base_msgs/MoveBase'

module.exports.error_json = error_json;
module.exports.successed_json = successed_json;
module.exports.timeout = timeout;
module.exports.default_timeout = default_timeout;
module.exports.navigate_frame_id = navigate_frame_id;
module.exports.root_dir = root_dir;
module.exports.maps_dir = maps_dir;

module.exports.getCoord = getCoord;

module.exports.getRclContext = rclcontext;



