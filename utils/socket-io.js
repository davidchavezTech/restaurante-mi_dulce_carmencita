let io;
exports.socketConnection = (server) => {
    io = require('socket.io')(server);
    io.on('connection', (socket) => {
    
        //Nueva orden de meseros
        socket.on('Nueva orden', (msg) => {
            console.log(msg)
            io.emit('Nueva orden', msg);
        })
        //Nueva orden lista de cocina
        socket.on('Nueva orden lista - cocina', (msg) => {
            console.log('se emitió:')
            console.log(msg)
            io.emit('Nueva orden lista - cocina', msg);
        })
        //Nueva plato listo de cocina
        socket.on('Nuevo plato listo - cocina', (tableID_and_dish_name) => {
            console.log('se emitió:')
            console.log(tableID_and_dish_name)
            io.emit('Nuevo plato listo - cocina', tableID_and_dish_name);
        })
        //Nueva cambio de stock de plato
        socket.on('cambio de stock - cocina', (platoID_and_stock_state) => {
            console.log('se emitió:')
            console.log(platoID_and_stock_state)
            io.emit('cambio de stock - cocina', platoID_and_stock_state);
        })

        //Nueva cambio de stock de plato
        socket.on('add dish to order', (data) => {
            console.log('se agregó un plato a una orden existente')
            io.emit('add dish to order', data);
        })
        //Nueva cambio de stock de plato
        socket.on('Orden cancelada', (platoName_mesaID) => {
            console.log('se canceló un plato')
            io.emit('Orden cancelada', platoName_mesaID);
        })
    });
};
exports.emit = (event, response) => io.emit(event, response);