# rosnodejs
mysql
![捕获](https://user-images.githubusercontent.com/59528140/179405791-7383b66c-6bea-4238-87d4-be2485ecc8bb.PNG)


## Setup Tutorial

### Install Nodejs & npm

Ubuntu: ```sudo apt install nodejs npm```  
The command may vary on different distros.

### Setup Ros Package

In your ros workspace, create a package as server. (Name it as whatever you want)
```shell
cd <path-to-your-workspace>/src
catkin_create_pkg apiserver
```
Configure your package.
First initialize npm in your package.
```shell
cd <path-to-your-workspace>/src/apiserver
npm init -y # initialize the npm
```
Then install necessary library in the server package you created.
```shell
npm install rosnodejs
npm install express
```
For more information about rosnojejs, check their [official repo](https://github.com/RethinkRobotics-opensource/rosnodejs).

### Clone this Project

In your server package create the scripts folder ```mkdir scripts && cd $_```.  
Then clone this project ```git clone https://github.com/Steve-Mr/ros_nodejs_backend.git```.


## Test
This project has only been tested in simulated environment with specified config, to run it with your robot may needs some configuration.  

1. Setup and run Your Robot
2. Start server.
In ```scripts``` folder run ```node server.js``` .  
We will use rostopic ```/cmd_vel``` for test, which contains the robot's realtime data, please modify the topic according to the actual situation.
Topic name in ```scripts/gs-robot/real_time_data/cmd_vel.js``` .  
3. Access data through GET request
Open your browser and go to ```localhost:8080/gs-robot/real_time_data/cmd_vel``` .  
You should get response like 
    ```json
    {"data":{"linear":{"x":0,"y":0,"z":0},"angular":{"x":0,"y":0,"z":0}},"errorCode":"","msg":"successed","successed":true}
    ```