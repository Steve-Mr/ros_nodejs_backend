const rosnodejs = require('rosnodejs');
let message;

let p = new Promise(function (resolve, reject) {

  rosnodejs.initNode('/realtime_subscriber').then(() => {
    const nh = rosnodejs.nh;

    nh.subscribe('cmd_vel', 'geometry_msgs/Twist', (msg) => {
      nh.unsubscribe('cmd_vel');
      resolve(msg)
    });
  });
})
p.then(function (data) {
  // const nh = rosnodejs.nh;
  // nh.unsubscribe(util.topic_cmd_vel);
  message = {
    "data": JSON.parse(JSON.stringify(data)), "errorCode": "",
    "msg": "successed", "successed": true
  }
  console.log(message)
  if(process.send){
    process.send(message);
  }else{
    console.log("error")
  }
  process.exit(0)
});
