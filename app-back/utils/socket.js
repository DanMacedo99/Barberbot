let io;

module.exports = {

    init: (httpServer) => {
        const { Server } = require('socket.io');
        io = new Server(httpServer, {
            cors: {
                origin: '*',
            },
        });

        io.on('connection', (socket) => {
            console.log('Usuário conectado:', socket.id);

            socket.on('disconnect', () => {
                console.log('Usuário desconectado:', socket.id);
            });
        });

        return io;
    },

    getIO: () => {
        if (!io) {
            throw new Error('Socket.io não foi inicializado!');
        }
        return io;
    },

}