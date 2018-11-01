const config = require('./config/config');
module.exports = function (io, appService) {
    console.log('Setting up node listener...');
    const clients = [];

    //client.emit('event:new')

    io.sockets.on('connection', (socket) => {
        clients.push(socket);

        socket.on('disconnect', () => {
            "use strict";
            clients.splice(clients.indexOf(socket),1);
        });

    });
};