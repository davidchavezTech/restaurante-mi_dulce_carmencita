const express = require('express');
const app = express();
const path = require('path');
const livereload = require('livereload')
const connectLiveReload = require('connect-livereload')
const hbs = require('express-handlebars');
const bcrypt = require('bcrypt')
const http = require('http').Server(app);
const io = require('socket.io')(http);

const publicDirectory = path.join(__dirname, 'public')

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(publicDirectory)
liveReloadServer.server.once("connection",()=>{
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
})
app.get('/fuck', (req, res) => {
    res.sendFile(__dirname + '/fuck.html');
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


io.on('connection', (socket) => {
    console.log('a user connected');
    
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
});


http.listen(PORT, () => console.log(`Server started on port ${PORT}`));


