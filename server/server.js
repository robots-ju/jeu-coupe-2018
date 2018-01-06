const http = require('http');
const io = require('socket.io');

// HTTP
const httpServer = http.createServer();
const httpPort = 8080;
httpServer.listen(httpPort);
console.log(`HTTP :${httpPort} ok`);

// SOCKET.IO
const socket = io.listen(httpServer);

socket.on('connection', client => {
    console.log('Client connected');

    client.on('test', position => {
        //
    });
});
