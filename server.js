const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

port = 8080 || 3000;

app.use(express.static(__dirname));

let pixelsReceived = 0;

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('change', (pixel) => {
    pixelsReceived++;
    io.emit('change', pixel);
  });

  socket.on('report', ()=>{
    console.log(`Server receieved ${pixelsReceived} pixels`)
  })

  /*
  socket.on('disconnect', () => {
    ;
  });
  */
});

server.listen(port, () => {
  console.log(`Socket server running on http://localhost:${port}`);
});

