import express from 'express';
import fs from 'fs';
import path from 'path';
import PingManager from './PingManager';
import WebSocket, { Server } from 'ws';

const app = express();



// 启动Views服务器
app.listen(8001, 'localhost', _ => {
  console.log('demo服务器已启动，访问地址http://localhost:8001')
})


// 托管静态目录
app.use('/public', express.static('public'))
// 处理Action
app.get('/', (req, res) => {
  res.send(fs.readFileSync(path.join("src/front/views/index.html")).toString())
})

const wsServer = new Server({ port: 8002 });

let socketClients = new Set<WebSocket>();

wsServer.on("connection", (socketClient) => {
  socketClients.add(socketClient)
})

let send = function (domain: string, data: Record<string, any>) {
  socketClients.forEach((sockertClient) => {
    if (sockertClient.readyState == 1) {
      sockertClient.send(JSON.stringify([
        domain,
        data.delay,
        data.time
      ]))
    } else {
      socketClients.delete(sockertClient);
    }
  })
}

var pingManager1 = new PingManager("127.0.0.1").start().on('data', (data: Number) => {
  console.log("127.0.0.1", data)
  send("127.0.0.1", data)
})

var pingManager2 = new PingManager("baidu.com").start().on('data', (data: Number) => {
  console.log("baidu.com", data)
  send("baidu.com", data)
})

export {

}