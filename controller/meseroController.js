const pool = require('../database')
const { emit } = require('../utils/socket-io');
// async function deleteMesasFromPastDays(){
//     let d = new Date();
//     let day = d.getDate()
//     let month = d.getMonth()
//     let year = d.getFullYear()
//     let currentDate  =  `${day}_${month}_${year}`
//     let result = await pool.pool_meseros.query(`
//         SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
//         WHERE TABLE_NAME NOT LIKE '${currentDate}%' AND TABLE_SCHEMA = 'meseros'`)
//     if(result.length==0) return
//     let mySQLquery = ''
//     for(let i = 0;result.length>i;i++){
//         if(result.length==i+1){
//             mySQLquery += `meseros.${result[i].TABLE_NAME};`
//         }else{
//             mySQLquery += `meseros.${result[i].TABLE_NAME},`
//         }
        
//     }
//     await pool.pool_meseros.query(`DROP TABLE ${mySQLquery}`)
// }
// deleteMesasFromPastDays()

const createMesa = async (req, res)=>{
    let d = new Date();
    let day = d.getDate()
    if(day<10) day = "0"+day
    let month = d.getMonth() + 1
    if(month<10) month = "0"+month
    let year = d.getFullYear()
    let currentDate  =  `${day}_${month}_${year}`
    let mesaID = req.body.mesaID
    let meseroName = req.user.nombre
    meseroName = meseroName.replace(/ /g,"")
    let mesaNewName = `${currentDate}_${meseroName}_${mesaID}`
    // await pool.pool_meseros.query(`DROP TABLE IF EXISTS ${mesaNewName}
    await pool.pool_meseros.query(`
    CREATE TABLE IF NOT EXISTS ${mesaNewName} ( 
        id INT PRIMARY KEY,
        nombre_producto VARCHAR(255) ,
        cantidad TINYINT,
        precio DECIMAL(4,1),
        categoria TINYINT,
        stock TINYINT,
        cocina VARCHAR(50),
        delivery_state TINYINT(1) DEFAULT 0,
        procesada TINYINT(1) DEFAULT 0,
        order_name VARCHAR(20) NULL,
        cancelada_pagada VARCHAR(20) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )  ENGINE=INNODB;
    `)
    res.json(mesaNewName)
}


const insertIntoMesa = async (req, res)=>{
    await pool.pool_meseros.query(`
        INSERT INTO ${req.body.orden.mesaName} (id, nombre_producto, cantidad, precio, categoria, stock, cocina)
        VALUES ('${req.body.orden.id}', '${req.body.orden.nombre_producto}', '${req.body.orden.cantidad}', '${req.body.orden.precio}', '${req.body.orden.categoria}', '${req.body.orden.stock}', '${req.body.orden.cocina}');
    `)
    res.json('Se grabó el nuevo plato en la DDBB corréctamente')
}


const increaseQuantityOfDish = async (req, res)=>{
    await pool.pool_meseros.query(`
        UPDATE ${req.body.orden.mesaName} SET cantidad='${req.body.orden.cantidad}' WHERE id='${req.body.orden.id}'
    `)
    res.json('Se incrementó la cantidad en la DDBB corréctamente')
}
const updateTable = async (req, res)=>{
    let current_orders = await pool.pool_ordenes.query(`
        SELECT id, nombre_producto, cantidad FROM ${req.body.data[0].order_name}
    `)
    for(let i=1;req.body.data.length>i;i++){
        let found = 0
        for(let j=1;current_orders.length>j;j++){
            if(req.body.data[i].nombre_producto==current_orders[j].nombre_producto){
                let total = parseFloat(req.body.data[i].precio) * parseFloat(req.body.data[i].cantidad)
                if(req.body.data[i].cantidad!=current_orders[j].cantidad){
                    await pool.pool_ordenes.query(`
                        UPDATE ${req.body.data[0].order_name} SET cantidad='${req.body.data[i].cantidad}', updated='1', total='${total}' WHERE id='${current_orders[j].id}'
                    `)
                }
                let response = {
                    mesaID: req.body.data[0].mesa,
                    producto: req.body.data[i].nombre_producto,
                    precio: req.body.data[i].precio,
                    cantidad: req.body.data[i].cantidad,
                    total: req.body.data[i].total,
                    cocina: req.body.data[i].cocina
                }
                emit('Plato updated', response);
                found=1
                j=req.body.data[j].length
            }
        }
        if(found==0){
            let total = parseFloat(req.body.data[i].precio) * parseFloat(req.body.data[i].cantidad)
            await pool.pool_ordenes.query(`
                    INSERT INTO ${req.body.data[0].order_name} (nombre_producto, precio, cantidad, cocina, total, updated)
                    VALUES ('${req.body.data[i].nombre_producto}', '${req.body.data[i].precio}', '${req.body.data[i].cantidad}', '${req.body.data[i].cocina}', '${total}', '1');
                `)
            let response = {
                mesaID: req.body.data[0].mesa,
                producto: req.body.data[i].nombre_producto,
                precio: req.body.data[i].precio,
                cantidad: req.body.data[i].cantidad,
                total: req.body.data[i].total,
                cocina: req.body.data[i].cocina
            }
            emit('Plato updated', response);
        }
        //Update total of all orders
        await pool.pool_ordenes.query(`
                UPDATE ${req.body.data[0].order_name} SET total='${req.body.data[0].total}' WHERE id='1'
                `)
        
    }
    res.json('Se actualizó la orden corréctamente')
}

const updateMeseroTable = async (req, res)=>{
    let current_orders = await pool.pool_meseros.query(`
        SELECT id, nombre_producto, cantidad FROM ${req.body.data[0].order_name}
    `)
    for(let i=1;req.body.data.length>i;i++){
        let found = 0
        for(let j=0;current_orders.length>j;j++){
            if(req.body.data[i].nombre_producto==current_orders[j].nombre_producto){
                if(req.body.data[i].cantidad!=current_orders[j].cantidad){
                    await pool.pool_meseros.query(`
                        UPDATE ${req.body.data[0].order_name} SET cantidad='${req.body.data[i].cantidad}' WHERE id='${current_orders[j].id}'
                    `)
                }
                let response = {
                    mesaID: req.body.data[0].mesa,
                    producto: req.body.data[i].nombre_producto,
                    precio: req.body.data[i].precio,
                    cantidad: req.body.data[i].cantidad,
                    total: req.body.data[i].total,
                    cocina: req.body.data[i].cocina
                }
                emit('Plato updated', response);
                found=1
                j=req.body.data[j].length
            }
        }
        if(found==0){
            let total = parseFloat(req.body.data[i].precio) * parseFloat(req.body.data[i].cantidad)
            await pool.pool_meseros.query(`
                    INSERT INTO ${req.body.data[0].order_name} (nombre_producto, precio, cantidad, cocina)
                    VALUES ('${req.body.data[i].nombre_producto}', '${req.body.data[i].precio}', '${req.body.data[i].cantidad}', '${req.body.data[i].cocina}');
                `)
            let response = {
                mesaID: req.body.data[0].mesa,
                producto: req.body.data[i].nombre_producto,
                precio: req.body.data[i].precio,
                cantidad: req.body.data[i].cantidad,
                total: req.body.data[i].total,
                cocina: req.body.data[i].cocina
            }
            emit('Plato updated', response);
        }
    }
    res.json('Se actualizó la orden corréctamente')
}

const isDishCancelled = async (req, res)=>{
    let response = await pool.pool_meseros.query(`
        SELECT cancelada_pagada FROM ${req.body.data.mesa_ddbb_name} WHERE nombre_producto = '${req.body.data.platoName}' 
    `)
    res.json(response[0].cancelada_pagada)
}


const dropDish = async (req, res)=>{
    await pool.pool_meseros.query(`
        DELETE FROM ${req.body.orden.mesaName} WHERE id="${req.body.orden.id}";
    `)
    res.json('Se removió el plato de la DDBB corréctamente')
}


const loadTables = async (req, res)=>{
    let ordersArray = []
    let meseroName = req.user.nombre
    
    let d = new Date();
    let day = d.getDate()
    if(day<10) day = "0" + day
    let month = d.getMonth() + 1
    if(month<10) month = "0" + month
    let year = d.getFullYear()
    let currentDate  =  `${day}_${month}_${year}`

    noSpacesMeseroName = meseroName.replace(/ /g,"")
    let mesas = await pool.pool_meseros.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_NAME LIKE '${currentDate}_${noSpacesMeseroName}%'`)
    for(let i=0;mesas.length>i;i++){
        //get ID from table name
        let mesaID = /[^_]*$/.exec(mesas[i].TABLE_NAME)[0];
        let mesa = await pool.pool_meseros.query(`
            SELECT * FROM ${mesas[i].TABLE_NAME}
        `)
        //set it to first value of mesa object
        // mesa.unshift(mesa[0].nombre_producto)
        mesa.unshift(mesas[i].TABLE_NAME)
        mesa.unshift(mesaID)
        ordersArray.push(mesa)
    }
    res.json(ordersArray)
}

const dropTable = async (req, res)=>{
    let d = new Date();
    let day = d.getDate()
    if(day<10) day = "0" + day
    let month = d.getMonth() + 1
    if(month<10) month = "0" + month
    let year = d.getFullYear()
    let currentDate  =  `${day}_${month}_${year}`
    let meseroName = req.user.nombre
    noSpacesMeseroName = meseroName.replace(/ /g,"")
    let mesaName = `${currentDate}_${noSpacesMeseroName}_${req.body.mesaID}`
    await pool.pool_meseros.query(`DROP TABLE IF EXISTS ${mesaName}`)
    res.json('Orden eliminada de la base de datos corréctamente')
}


module.exports = {
    createMesa,
    insertIntoMesa,
    increaseQuantityOfDish,
    dropDish,
    loadTables,
    dropTable,
    updateTable,
    isDishCancelled,
    updateMeseroTable
}