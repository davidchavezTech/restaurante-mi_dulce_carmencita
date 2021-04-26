const pool = require('../database')

const aperturarCaja = async (res, montoDeApertura, nombres)=>{
    try{
        try{
            await pool.restaurante.query(`
            INSERT INTO caja (cajero, abrir)
            VALUES ('${nombres}', '${montoDeApertura}');
            `)
            res.json(true)
        }catch(err){
            res.json(err)
        }
    }catch(err){
        res.json(err)
    }
}
const findCaja = async (name, date)=>{
    let seAbrioCajaCon = await pool.restaurante.query(`SELECT abrir FROM caja WHERE cajero = '${name}' AND date = '${date}' AND cerrar IS NULL LIMIT 1`);
    return(seAbrioCajaCon.length==1) ? seAbrioCajaCon[0].abrir : false
}
const cerrarCaja = async (res, name, date, monto,)=>{
    try{
        await pool.restaurante.query(`UPDATE caja
        SET cerrar='${monto}'
        WHERE cajero = '${name}' AND date = '${date}' AND cerrar IS NULL LIMIT 1`);
    }catch(err){
        console.log(err)
        res.json(err)
    }
}

const postPayment = async (req, res)=>{
    let mesaName = req.body.mesaName
    let efectivo = req.body.efectivo
    let tarjeta = req.body.tarjeta
    let yape = req.body.yape
    try{
        await pool.pool_ordenes.query(`UPDATE ${mesaName} SET procesada='1', cajero='${req.user.nombre}', efectivo='${efectivo}', tarjeta='${tarjeta}', yape='${yape}' WHERE id='1'`);
        res.json(true)
    }catch(err){
        res.json(err)
    }
}

const postNuevoIngresoAcaja = async (req, res)=>{
    let d = new Date();
    let day = d.getDate()
    let month = d.getMonth() + 1
    if(month<10) month = "0" + month
    let year = d.getFullYear()
    let currentDate  =  `${year}-${month}-${day}`
    try{
        let storedIngresos = await pool.restaurante.query(`SELECT ingresos FROM caja 
            WHERE cajero='${req.user.nombre}' AND date='${currentDate}' AND cerrar IS NULL LIMIT 1`);
        storedIngresos = storedIngresos[0].ingresos
        let nuevosIngresos = parseFloat(req.body.ingresos, 2)
        let ingresosParaInsertar = storedIngresos + nuevosIngresos
        await pool.restaurante.query(`UPDATE caja SET ingresos='${ingresosParaInsertar}'
        WHERE cajero='${req.user.nombre}' AND date='${currentDate}' AND cerrar IS NULL LIMIT 1`);
        res.json(true)
    }catch(err){
        console.log(err)
        res.json(err)
    }
}

const caja_amount_request = async (req, res) =>{
    let d = new Date();
    let day = d.getDate()
    let month = d.getMonth() + 1
    if(month<10) month = "0" + month
    let year = d.getFullYear()
    let currentDate  =  `${year}-${month}-${day}`
    try{
        let storedIngresos = await pool.restaurante.query(`SELECT (abrir + ingresos) AS total FROM caja 
            WHERE cajero='${req.user.nombre}' AND date='${currentDate}' AND cerrar IS NULL LIMIT 1`);
        
        res.json(storedIngresos[0].total)
    }catch(err){
        console.log(err)
        res.json(false)
    }
}
module.exports = {
    aperturarCaja,
    findCaja,
    cerrarCaja,
    postPayment,
    postNuevoIngresoAcaja,
    caja_amount_request
}