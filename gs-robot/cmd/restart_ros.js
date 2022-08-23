const express = require('express')
const router = express.Router()
const shell = require('shelljs')

const util = require('../util')

router.get('/restart_ros', (req, res) => {
    const {spawn} = require('child_process')
    // new Promise(function(resolve, reject){
    //     let kill_gazebo = exec('killall -9 gazebo & killall -9 gzserver  & killall -9 gzclient');
    //     console.log("gazebo killed")
    //     resolve('gazebo killed')
        
    // }).then(function(){
    //     new Promise(function(resolve, reject){
    //         let kill_nodes = exec('rosnode kill -a', (error, stdout, stderr) => {
    //             console.log(stdout);
    //             console.log('rosnodes killed')
    //             resolve('rosnodes killed')
    //         })
    //     }).then(function(){
    //         exec('source ~/code/catkin_ws/devel/setup.bash');
    //         console.log('tring to start ros');
    //         exec('roslaunch mobile_manipulator mobile_manipulator_move_base.launch',
    //         (error, stdout, stderr) => {
    //             console.log(stdout);
    //             res.json(util.successed_json)
    //         })
    //     })
    // })
    new Promise(function(resolve, reject){
        shell.exec('killall -9 gazebo & killall -9 gzserver  & killall -9 gzclient');
        console.log("gazebo killed")
        resolve('gazebo killed')
        
    }).then(function(){
        new Promise(function(resolve, reject){
            shell.exec('rosnode kill -a')
            resolve('rosnodes killed')
            console.log('rosnodes killed');
        }).then(function(){
            res.json(util.successed_json)
            spawn(shell.exec('nohup roslaunch mobile_manipulator mobile_manipulator_move_base.launch'),{
                detached: true
            });
            
            // shell.exec('source ~/code/catkin_ws/devel/setup.bash');
            // console.log('tring to start ros');
            // shell.exec('roslaunch mobile_manipulator mobile_manipulator_move_base.launch')
            
        })
    })
    

})

module.exports = router