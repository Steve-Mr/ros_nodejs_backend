const rosnodejs = require('rosnodejs');
let message;
const util = require('../util')

let p = new Promise(function (resolve, reject) {

  rosnodejs.initNode('/realtime_subscriber').then(() => {
    const nh = rosnodejs.nh;

    const sub = nh.subscribe(util.topic_cmd_vel, 'geometry_msgs/Twist', (msg) => {
      resolve(msg)
    });
  });
})
p.then(function (data) {
  rosnodejs.nh.unsubscribe(util.topic_cmd_vel);
  message = {
    "data": JSON.parse(JSON.stringify(data)), "errorCode": "",
    "msg": "successed", "successed": true
  }
  process.send(message);
});
