#!/usr/bin/env node

const express = require('express');
const router = express.Router();


 router.get('/cmd_vel', (req, res) => {
 
const rosnodejs = require('rosnodejs');
const correct=JSON.parse('{"errorCode":"","msg":"successed","successed":true}');
var message;

  // Promise 保证事件顺序进行， resolve 将参数传递给后续 then
  var p = new Promise(function(resolve, reject){
  rosnodejs.initNode('/my_node').then(() => {
  const nh = rosnodejs.nh;
  const sub = nh.subscribe('/cmd_vel', 'geometry_msgs/Twist',(msg) => {
  resolve(msg)
});
});	          
	}) 
   p.then(function(data){         
                message={"data":JSON.parse(JSON.stringify(data)),"errorCode":"",
                "msg":"successed","successed":true}
		 res.send(JSON.stringify(message))
		 });
 })
 
module.exports=router
