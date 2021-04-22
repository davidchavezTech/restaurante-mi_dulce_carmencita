require('dotenv').config()

const express = require('express');
let router = express.Router();
const bcrypt = require('bcrypt')
const path = require('path');
const pool = require('../database')
const jwt = require('jsonwebtoken')
const postToOrdenesModel = require('../model/postToOrdenes')
const userModel = require('../model/userModel')
const cajaModel = require('../model/cajaModel')
const cocinaModel = require('../model/cocinaModel')
const meseroController = require('../controller/meseroController')

let authorizedURLsForMesero = [
    'http://localhost:4000/inicio-mesero',
]
let authorizedURLsForCaja = [
    'http://localhost:4000/inicio-caja',
]
let authorizedURLsForCocina = [
    'http://localhost:4000/cocina',
]
function authorizeURL(permission, url){
    let searchArray, matchFound
    if(permission=='caja') (searchArray = authorizedURLsForCaja )
    if(permission=='mesero') (searchArray = authorizedURLsForMesero )
    if(permission=='cocina') (searchArray = authorizedURLsForCocina )
    if(!searchArray) return false
    for(let i=0;searchArray.length>i;i++){
        if(searchArray[i]==url){
            matchFound=true
            i=searchArray.length
        }
    }
    return matchFound ? true : false
}
//Nos permite ver la info del formulario que se envió por <form></form>
router.use(express.urlencoded({ extended: true}));

router.get('/', async (req, res) => {

    res.render('loguearse', {title: 'Loguearse'});
    
});

router.get('/inicio-caja', async (req, res) => {
    res.render('inicio-caja', {title: 'Caja'});
});

router.get('/inicio-mesero', async (req, res) => {
    res.render('inicio-mesero', {title: 'Mesas'});
    
});

router.post('/login', async (req, res, next) => {

    // const foundUser = await pool.restaurante.query(`SELECT * FROM usuarios WHERE email = '${req.body.email}'`);
    const foundUser = await userModel.findUser(res, req.body.email)
    
    if(foundUser){
        const foundUsersEmail = foundUser[0].email
        const setPermission = foundUser[0].set_permission
        const foundUserspassword = foundUser[0].pwd
        try{
            if(await bcrypt.compare(req.body.password, foundUserspassword)){
                if(setPermission=='mesero') url='http://localhost:4000/inicio-mesero'
                if(setPermission=='caja') url='http://localhost:4000/inicio-caja'
                if(setPermission=='cocina') url='http://localhost:4000/cocina'
                //create the user object
                const user = {
                                email: foundUsersEmail,
                                permission: setPermission,
                                nombre: foundUser[0].names
                            }
                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
                res.json({ accessToken: accessToken,
                            url})
            }else{
                res.json(false)
            }
        }catch(error) {
            console.error(error);
          }
    }else{
        res.json(false)
    }
})

router.post('/inicio', isUserLoggedIn, async (req, res) => {
    let responseObject = ''
    let html = ''
    if(req.user.permission=='admin'){
        let result = await pool.restaurante.query(`SELECT * FROM usuarios`);
        result.forEach(usuario =>{
            let role
            switch (usuario.set_permission) {
                case 'admin':
                    role='Administrador'
                    break
                case 'mesero':
                    role='Mesero'
                    break
                case 'caja':
                    role='cajero'
                    break
                case 'cocina':
                    role='Cocina'
                    break
            }
            html = html + `<tr>
                            <td scope="row">${usuario.id}</td>
                            <td>${usuario.names}</td>
                            <td>${usuario.email}</td>
                            <td>${role}</td>
                            <td><input type='checkbox'></td>
                          </tr>
                            `
        })
        const headers = ['id', 'Nombres','Correo','Posición','stock']
        responseObject = {
            permission: 'admin',
            headers,
            html
        } 
        
    }else if(req.user.permission=='mesero'){
        let result = await pool.restaurante.query(`SELECT * FROM productos`);
        result.forEach(producto =>{
            html = html + ` <tr id="orden">
                                <td class="hidden">${producto.id}</td>
                                <td style="padding-top:15px;">${producto.nombre_producto}</td>
                                <td class="text-align-center hidden" style="padding-top:15px;">1</td>
                                <td class="text-align-center" style="padding-top:15px;">${producto.precio_venta}</td>
                                <td class="hidden cat-selector">${producto.categoria}</td>
                                <td class="hidden">${producto.stock}</td>
                            </tr>`
        })
        const headers = ['id', 'Producto','cantidad','Precio','Categoría', 'stock']
        responseObject = {
            permission: 'mesero',
            headers,
            html
        } 
    }
    res.json(responseObject)
})

router.post('/inicio-mesero', isUserLoggedIn, async (req, res) => {
    let html = ''
    let result = await pool.restaurante.query(`SELECT * FROM productos`);
    result.forEach(producto =>{
        html = html + ` <tr id="orden">
                            <td class="hidden">${producto.id}</td>
                            <td style="padding-top:15px;">${producto.nombre_producto}</td>
                            <td class="text-align-center hidden" style="padding-top:15px;">1</td>
                            <td class="text-align-center" style="padding-top:15px;">${producto.precio_venta}</td>
                            <td class="hidden cat-selector">${producto.categoria}</td>
                            <td class="hidden">${producto.stock}</td>
                        </tr>`
    })
    const headers = ['id', 'Producto','cantidad','Precio','Categoría', 'stock']
    responseObject = {
        nombres: req.user.nombre,
        headers,
        html
    } 
    
    res.json(responseObject)
})
router.post('/authenticate', isUserLoggedIn, (req, res) => {
    res.json('Correct JWT')
})

router.post('/post_orden', async (req,res)=>{
    let data = req.body.data
    
    //CREAR MESA
    let numberOfTables = await pool.pool_ordenes.query(`SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'ordenes' and TABLE_TYPE='BASE TABLE'`);
    numberOfTables = numberOfTables[0]['COUNT(*)']
    let d = new Date();
    let day = d.getDate()
    let month = d.getMonth()
    let year = d.getFullYear()
    let currentDate  =  `${day}_${month}_${year}`
    let id = numberOfTables + 1
    await pool.pool_ordenes.query(`
        CREATE TABLE IF NOT EXISTS ${currentDate+'_'+id} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre_producto VARCHAR(255) ,
            precio TINYINT,
            cantidad TINYINT,
            cancelada_pagada TINYINT DEFAULT 1,
            administrador VARCHAR(255),
            mesero VARCHAR(255),
            cajero VARCHAR(255),
            procesada TINYINT DEFAULT 0,
            preparada TINYINT DEFAULT 0,
            efectivo TINYINT,
            tarjeta TINYINT,
            yape TINYINT,
            mesa TINYINT DEFAULT 0,
            total TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )  ENGINE=INNODB;
    `)
    await pool.pool_ordenes.query(`
    INSERT INTO ${currentDate+'_'+id} (nombre_producto, mesero, mesa, total)
    VALUES ('${currentDate+'_'+id}', '${data[0].mesero}', '${data[0].mesa}', '${data[0].total}');
    `)
    for(let i=1;data.length>i;i++){
        await pool.pool_ordenes.query(`
            INSERT INTO ${currentDate+'_'+id} (
                nombre_producto,
                precio,
                cantidad,
                total)
            VALUES (
                '${data[i].nombre_producto}',
                '${data[i].precio}',
                '${data[i].cantidad}',
                '${data[i].total}');
        `)
    }
    //created html - send it to socket:
    data[0].nombre_producto = currentDate+'_'+id
    res.json(data)
})


router.post('/get_todays_orders', async (req,res)=>{
    let d = new Date();
    let day = d.getDate()
    let month = d.getMonth()
    let year = d.getFullYear()
    currentDate  =  `${day}_${month}_${year}`
    //get all the tables with the name of todays date--
    let result = await pool.pool_ordenes.query(`SELECT * FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_NAME LIKE '${currentDate}%'`)
    let dataToSend = []
    
    
    for(let i=0;result.length>i;i++){
        let atencion = []
        let tableName = result[i].TABLE_NAME
        const currentTable = await pool.pool_ordenes.query(`SELECT * FROM ${tableName}`);
        if(currentTable[0].procesada==0){
            for(let i=0;currentTable.length>i;i++){
                let dataToPush = {}
                dataToPush.nombre_producto = currentTable[i].nombre_producto
                dataToPush.precio = currentTable[i].precio
                dataToPush.cantidad = currentTable[i].cantidad
                dataToPush.cancelada_pagada = currentTable[i].cancelada_pagada
                dataToPush.mesa = currentTable[i].mesa
                dataToPush.total = currentTable[i].total
                atencion.push(dataToPush)
            }
            dataToSend.push(atencion)
        }
    }
    res.json(dataToSend)
})
router.post('/admin-cancelar_plato', async (req, res)=>{
    let cancelada_pagada
    (req.body.isItChecked=='true') ? cancelada_pagada = 1: cancelada_pagada = 0
    const foundUser = await pool.restaurante.query(`SELECT * FROM usuarios WHERE email = '${req.body.email}'`);
    if(foundUser.length!=0){
        const setPermission = foundUser[0].set_permission
        const foundUserspassword = foundUser[0].pwd
        try{
            if(await bcrypt.compare(req.body.password, foundUserspassword)&&setPermission=="admin"){
                let admin = foundUser[0].names
                let plato = req.body.plato
                let mesaName = req.body.mesaName
                await pool.pool_ordenes.query(`UPDATE ${mesaName} SET cancelada_pagada='${cancelada_pagada}', administrador='${admin}' WHERE nombre_producto='${plato}'`)

                res.json(cancelada_pagada)
            }else{
                res.json(false)
            }

        }catch(error) {
            res.json(false)
        }
    }else{
        res.json(false)
    }
})

router.post('/caja-pay_pedido', isUserLoggedIn, async (req, res)=>{
    postToOrdenesModel.postPayment(res, req.body, req.user.nombre)
})
router.post('/caja-cerrar_caja', isUserLoggedIn, async (req, res)=>{
    let d = new Date();
    let day = d.getDate()
    let month = d.getMonth() + 1
    if(month<10) month = "0" + month
    let year = d.getFullYear()
    let currentDate  =  `${year}-${month}-${day}`
    await cajaModel.cerrarCaja(res, req.user.nombre, currentDate, req.body.monto)
    res.json(true)
})

router.post('/esta_caja_abierta', isUserLoggedIn, async (req,res)=>{
    let d = new Date();
    let day = d.getDate()
    let month = d.getMonth() + 1
    if(month<10) month = "0" + month
    let year = d.getFullYear()
    let currentDate  =  `${year}-${month}-${day}`
    let cajaAbiertaConCuanto = await cajaModel.findCaja(req.user.nombre, currentDate)
    res.json(cajaAbiertaConCuanto)
})


router.post('/caja-aperturar_caja', isUserLoggedIn, async (req, res)=>{
    cajaModel.aperturarCaja(res, req.body.montoAperturarCaja, req.user.nombre)
})
router.post('/admin-cancelar_whole_order', async (req, res)=>{
    let cancelada_pagada
    (req.body.isItChecked=='true') ? cancelada_pagada = 1: cancelada_pagada = 0
    const foundUser = await pool.restaurante.query(`SELECT * FROM usuarios WHERE email = '${req.body.email}'`);
    if(foundUser.length!=0){
        const setPermission = foundUser[0].set_permission
        const foundUserspassword = foundUser[0].pwd
        try{
            if(await bcrypt.compare(req.body.password, foundUserspassword)&&setPermission=="admin"){
                let admin = foundUser[0].names
                let mesaName = req.body.mesaName
                await pool.pool_ordenes.query(`UPDATE ${mesaName} SET cancelada_pagada='${cancelada_pagada}', administrador='${admin}'`)

                res.json(cancelada_pagada)
            }else{
                res.json(false)
            }
        }catch(error) {
            res.json(false)
        }
    }else{
        res.json(false)
    }
})

router.post('/cocina-get_todays_orders', cocinaModel.getOrders)
function isUserLoggedIn(req, res, next){
    const authHeader = req.body.headers.Authorization
    const url = req.body.url
    console.log(url)
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
        if (err) return res.send(false)
        //Check if they are allowed to be in this url
        if(!authorizeURL(user.permission, url)) return res.send(false)
        req.user = user
        next()
    })
}

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)

    // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
    //     if (err) return res.sendStatus(403)
    //     req.user = user
    //     next()
    // })
}

router.get('/cocina', (req,res)=>{
    res.render('cocina', {title: 'cocina'});
})
//**************************MESERO *****************************//
//**************************MESERO *****************************//
router.post('/mesero-guardar_orden', isUserLoggedIn, meseroController.createMesa)
router.post('/mesero-agregar_plato_a_orden', isUserLoggedIn, meseroController.insertIntoMesa)
router.post('/mesero-agregar_cantidad_de_plato_a_la_orden', isUserLoggedIn, meseroController.increaseQuantityOfDish)
router.post('/mesero-drop_dish_from_order', isUserLoggedIn, meseroController.dropDish)
router.post('/mesero-load_tables', isUserLoggedIn, meseroController.loadTables)
router.post('/mesero-drop_table', isUserLoggedIn, meseroController.dropTable)
module.exports = router;