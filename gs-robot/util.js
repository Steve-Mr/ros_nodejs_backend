/**
 * 帮助类，方便一些量的修改和更新
 * 
 * 在调用时使用相对路径即可
 */

// 出错返回
const error_json = {
  "data": "{}",
  "errorCode": "",
  "msg": "failed",
  "successed": false
}

// 成功返回
const successed_json = {
  "data": "",
  "errorCode": "",
  "msg": "successed",
  "successed": true
}

// 返回一个时间对象，用于设置超时计时中
function timeout(seconds) {
  return {
    secs: seconds,
    nsecs: 0
  }
};

const node_name = '/navigation_node';

function init_connection(node_name) {
  const rosnodejs = require('rosnodejs')
  rosnodejs.initNode(node_name)
  rosnodejs.reset()
  rosnodejs.shutdown()
  rosnodejs.initNode(node_name, { timeout: 0 })
    .then(() => {
      console.log("init successed");
      // res.json(util.successed_json)
    })
    .catch((err) => {
      console.log(err)
      // res.json(util.error_json)
    })
}

// const rosnodejs = require('rosnodejs')
// const nh = rosnodejs.nh;

// const ac = new rosnodejs.SimpleActionClient({
//   nh,
//   type: 'move_base_msgs/MoveBase',
//   actionServer: '/move_base'
// });

new Promise(function (resolve, reject) {
  const rosnodejs = require('rosnodejs')
  rosnodejs.initNode(node_name, { onTheFly: true }).then(() => {
    const nh = rosnodejs.nh;
    console.log('getting simpleactionclient...')
    const ac = new rosnodejs.SimpleActionClient({
      nh,
      type: 'move_base_msgs/MoveBase',
      actionServer: '/move_base'
    })
    resolve(ac)
  })
}).then(function (data) {
  module.exports.sac = data;

})
// rosnodejs.initNode(node_name, { onTheFly: true }).then(() => {
//   const nh = rosnodejs.nh;
//   console.log('getting simpleactionclient...')
//   ac = new rosnodejs.SimpleActionClient({
//     nh,
//     type: 'move_base_msgs/MoveBase',
//     actionServer: '/move_base'
//   })
// })

// 默认超时时长
const default_timeout = 180;

// 导航中指向的 frame id，需要根据不同情况进行修改
const navigate_frame_id = 'map'

const path = require('path');
const app = require('./cmd');

const root_dir = __dirname

const maps_dir = path.join(__dirname, "data", "maps");

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
module.exports.init_connection = init_connection;
module.exports.node_name = node_name;

// module.exports.sac = ac;




