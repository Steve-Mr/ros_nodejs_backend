// 导入 express
const express = require('express');
// 创建 express实例，也就是创建 express服务器
const app = express();

app.use('/gs-robot', require('./gs-robot/real_time_data'))
// 路由器注册，收到请求，启用对应路由
app.use('/gs-robot', require('./gs-robot/data'))
app.use('/gs-robot', require('./gs-robot/cmd'))


// 启动服务器
app.listen(8080, function () {
  console.log('服务器已启动')
})

