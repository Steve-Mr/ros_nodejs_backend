#!/usr/bin/env node

const express = require('express');
const router = express.Router();


 router.get('/task_confirm', (req, res) => {
 
const rosnodejs = require('rosnodejs');
let date = new Date();
let year = date.getFullYear();
let month = date.getMonth()+1;
let day = date.getDate();
let hour = date.getHours();
let minute = date.getMinutes();
let second = date.getSeconds();
let time=year+''+month+''+day+''+hour+''+minute+''+second;
const correct={"type":"0102","vehid": "000001",   "taskid":"XXX","action":"ok", "time ":time};
  let p = new Promise(function(resolve, reject){
  rosnodejs.initNode('/my_node').then(() => {
  const nh = rosnodejs.nh;
  const sub = nh.subscribe('/move_base_node/current_goal', '#!/usr/bin/env node

const express = require('express');
const router = express.Router();


 router.get('/task_confirm', (req, res) => {
 
const rosnodejs = require('rosnodejs');
let date = new Date();
let year = date.getFullYear();
let month = date.getMonth()+1;
let day = date.getDate();
let hour = date.getHours();
let minute = date.getMinutes();
let second = date.getSeconds();
let time=year+''+month+''+day+''+hour+''+minute+''+second;
const correct={"type":"0104","vehid": "000001", "taskid":"XXX","onsiteid":"XXXXX","onsite":"X,Y","time ":time};

  let p = new Promise(
  function(resolve, reject){
  rosnodejs.initNode('/my_node').then(() => {
  const nh = rosnodejs.nh;
  const sub = nh.subscribe('/move_base/result', 'geometry_msgs/PoseStamped',(msg) => {
  resolve();
  });
});
}
) 

   p.then(function(data){         
		 res.send(JSON.stringify(correct))
		 });
 })
 
module.exports=router',(msg) => {
  resolve(msg);
  
});
});	          
	})
	 
   p.then(function(data){         
		 res.send(JSON.stringify(correct))
		 });
 })
 
module.exports=router
