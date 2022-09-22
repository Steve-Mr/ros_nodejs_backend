const rosnodejs = require('rosnodejs');
let message;


let p = new Promise(function (resolve, reject) {

  rosnodejs.initNode('/realtime_subscriber').then(() => {
    const nh = rosnodejs.nh;

    const sub = nh.subscribe('/robot_base_velocity_controller/cmd_vel', 'geometry_msgs/Twist', (msg) => {
      resolve(msg)
    });
  });
})
p.then(function (data) {
  rosnodejs.nh.unsubscribe('/robot_base_velocity_controller/cmd_vel');
  message = {
    "data": JSON.parse(JSON.stringify(data)), "errorCode": "",
    "msg": "successed", "successed": true
  }
  process.send(message);
});
