const pool = require('../database')

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
    let month = d.getMonth()
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
        precio TINYINT,
        categoria TINYINT,
        stock TINYINT,
        delivery_state TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )  ENGINE=INNODB;
    `)
    res.json(mesaNewName)
}


const insertIntoMesa = async (req, res)=>{
    // await pool.pool_meseros.query(`DROP TABLE IF EXISTS ${mesaNewName}
    await pool.pool_meseros.query(`
        INSERT INTO ${req.body.orden.mesaName} (id, nombre_producto, cantidad, precio, categoria, stock)
        VALUES ('${req.body.orden.id}', '${req.body.orden.nombre_producto}', '${req.body.orden.cantidad}', '${req.body.orden.precio}', '${req.body.orden.categoria}', '${req.body.orden.stock}');
    `)
    res.json('Se grabó el nuevo plato en la DDBB corréctamente')
}


const increaseQuantityOfDish = async (req, res)=>{
    // await pool.pool_meseros.query(`DROP TABLE IF EXISTS ${mesaNewName}
    await pool.pool_meseros.query(`
        UPDATE ${req.body.orden.mesaName} SET cantidad='${req.body.orden.cantidad}' WHERE id='${req.body.orden.id}'
    `)
    res.json('Se incrementó la cantidad en la DDBB corréctamente')
}


const dropDish = async (req, res)=>{
    // await pool.pool_meseros.query(`DROP TABLE IF EXISTS ${mesaNewName}
    await pool.pool_meseros.query(`
        DELETE FROM ${req.body.orden.mesaName} WHERE id="${req.body.orden.id}";
    `)
    res.json('Se removió el plato de la DDBB corréctamente')
}


const loadTables = async (req, res)=>{
    let ordersArray = []
    let meseroName = req.user.nombre
    noSpacesMeseroName = meseroName.replace(/ /g,"")
    let mesas = await pool.pool_meseros.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_NAME LIKE '%${noSpacesMeseroName}%'`)
    for(let i=0;mesas.length>i;i++){
        //get ID from table name
        let mesaID = /[^_]*$/.exec(mesas[i].TABLE_NAME)[0];
        let mesa = await pool.pool_meseros.query(`
            SELECT * FROM ${mesas[i].TABLE_NAME}
        `)
        //set it to first value of mesa object
        mesa.unshift(mesas[i].TABLE_NAME)
        mesa.unshift(mesaID)
        ordersArray.push(mesa)
    }
    res.json(ordersArray)
}

const dropTable = async (req, res)=>{
    let d = new Date();
    let day = d.getDate()
    let month = d.getMonth()
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
    dropTable
}