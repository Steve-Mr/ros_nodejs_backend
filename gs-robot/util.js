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
function timeout(seconds){
    return {
        secs: seconds,
        nsecs: 0
    }
};

// 默认超时时长
const default_timeout = 180;

// 导航中指向的 frame id，需要根据不同情况进行修改
const navigate_frame_id = 'map'

const path = require('path')

const root_dir = __dirname

const maps_dir = path.join(__dirname, "data", "maps");

module.exports.error_json = error_json;
module.exports.successed_json = successed_json;
module.exports.timeout = timeout;
module.exports.default_timeout = default_timeout;
module.exports.navigate_frame_id = navigate_frame_id;
module.exports.root_dir = root_dir;
module.exports.maps_dir = maps_dir;