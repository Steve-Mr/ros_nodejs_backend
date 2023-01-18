// 导入依赖
// 导入 express
const express = require('express');

const ws = require('ws')
const wss = new ws.Server({noServer: true});
wss.on('connection', socket => {
  socket.on('message', message => console.log(message))
})


// 创建 express实例，也就是创建 express服务器
const app = express();

app.use('/gs-robot', require('./gs-robot/real_time_data'))
// 路由器注册，收到请求，启用对应路由
app.use('/gs-robot', require('./gs-robot/data'))
app.use('/gs-robot', require('./gs-robot/cmd'))


const server = app.listen(8089);
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request)
  })
})

// 启动服务器
// 监听 8080 端口
app.listen(8088, function () {
  console.log('服务器已启动')
})

