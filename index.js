const express = require('express');
const app = express();
const path = require('path');
const livereload = require('livereload')
const connectLiveReload = require('connect-livereload')

const publicDirectory = path.join(__dirname, 'public')

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(publicDirectory)
liveReloadServer.server.once("connection",()=>{
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
})
app.use(connectLiveReload());
const PORT = process.env.PORT || 4000;

//set static folder
app.use(express.static(publicDirectory))

app.get('/', (req, res) => {
    res.render('index');
});

app.use(require('./routes/routes'));


//Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));