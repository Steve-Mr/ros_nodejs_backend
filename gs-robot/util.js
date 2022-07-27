const error_json = {
    "data": "{}",
    "errorCode": "",
    "msg": "failed",
    "successed": false
  }

const successed_json = {
    "data": "",
    "errorCode": "",
    "msg": "successed",
    "successed": true
  }

function timeout(seconds){
    return {
        secs: seconds,
        nsecs: 0
    }
};

const default_timeout = 180;

module.exports.error_json = error_json;
module.exports.successed_json = successed_json;
module.exports.timeout = timeout;
module.exports.default_timeout = default_timeout;