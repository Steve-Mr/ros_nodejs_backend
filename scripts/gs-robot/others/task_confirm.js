#!/usr/bin/env node

const express = require('express');
const router = express.Router();


 router.get('/task_confirm', (req, res) => {
 
const rosnodejs = require('rosnodejs');
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth()+1;
var day = date.getDate();
var hour = date.getHours();
var minute = date.getMinutes();
var second = date.getSeconds();
var time=year+''+month+''+day+''+hour+''+minute+''+second;
const correct={"type":"0102","vehid": "000001",   "taskid":"XXX","action":"ok", "time ":time};
  var p = new Promise(function(resolve, reject){
  rosnodejs.initNode('/my_node').then(() => {
  const nh = rosnodejs.nh;
  const sub = nh.subscribe('/move_base_node/current_goal', 'geometry_msgs/PoseStamped',(msg) => {
  resolve(msg);
  
});
});	          
	})
	 
   p.then(function(data){         
		 res.send(JSON.stringify(correct))
		 });
 })
 
module.exports=router
