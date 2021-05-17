const express = require('express');
const app = express();
const path = require('path');
const livereload = require('livereload')
const connectLiveReload = require('connect-livereload')
const hbs = require('express-handlebars');
const bcrypt = require('bcrypt')
const http = require('http').Server(app);
const { socketConnection } = require('./utils/socket-io');
socketConnection(http);
// const io = require('socket.io')(http);
const open = require( 'open' );

const publicDirectory = path.join(__dirname, 'public')

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(publicDirectory)
liveReloadServer.server.once("connection",()=>{
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
})

//view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs')


let encryptPassword = async (pwd) => {
    const hashedPassword = await bcrypt.hash(pwd, 10)
    // console.log('The encrypted password is: ' + hashedPassword)
}
encryptPassword('test')


app.use(connectLiveReload());
const PORT = process.env.PORT || 4000;

//set static folder
app.use(express.static(publicDirectory))

app.use(require('./routes/routes'));


// io.on('connection', (socket) => {
    
//     //Nueva orden de meseros
//     socket.on('Nueva orden', (msg) => {
//         console.log(msg)
//         io.emit('Nueva orden', msg);
//     })
//     //Nueva orden lista de cocina
//     socket.on('Nueva orden lista - cocina', (msg) => {
//         console.log('se emitió:')
//         console.log(msg)
//         io.emit('Nueva orden lista - cocina', msg);
//     })
//     //Nueva plato listo de cocina
//     socket.on('Nuevo plato listo - cocina', (tableID_and_dish_name) => {
//         console.log('se emitió:')
//         console.log(tableID_and_dish_name)
//         io.emit('Nuevo plato listo - cocina', tableID_and_dish_name);
//     })
//     //Nueva cambio de stock de plato
//     socket.on('cambio de stock - cocina', (platoID_and_stock_state) => {
//         console.log('se emitió:')
//         console.log(platoID_and_stock_state)
//         io.emit('cambio de stock - cocina', platoID_and_stock_state);
//     })

//     //Nueva cambio de stock de plato
//     socket.on('add dish to order', (data) => {
//         console.log('se agregó un plato a una orden existente')
//         io.emit('add dish to order', data);
//     })
// });

// log IP
//need

const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}
// console.log(results)
// console.log(results['Wi-Fi'][0]+':'+PORT)


http.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// http.listen(PORT, async () => {
//    await open( `http://${results['Wi-Fi'][0]}:${PORT}` );
// });

// http.listen(PORT);


