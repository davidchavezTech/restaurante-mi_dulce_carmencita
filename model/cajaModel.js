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
    let d = new Date()
    let hours = d.getHours()
    let minutes = d.getMinutes()
    let currentTime = `${hours}:${minutes}`
    try{
        await pool.restaurante.query(`UPDATE caja
        SET cerrar='${monto}', horaCerrarCaja = '${currentTime}'
        WHERE cajero = '${name}' AND date = '${date}' AND cerrar IS NULL LIMIT 1`);
    }catch(err){
        console.log(err)
        res.json(err)
    }
}

const postPayment = async (req, res)=>{
    let mesaName = req.body.mesaName
    let efectivo = req.body.efectivo
    if(efectivo==''){
        efectivo=0
    }else{
        efectivo = parseFloat(efectivo)
    } 
    let tarjeta = req.body.tarjeta
    if(tarjeta==''){
        tarjeta=0
    }else{
        tarjeta = parseFloat(tarjeta)
    }
    let yape = req.body.yape
    if(yape==''){
        yape=0
    }else{
        yape = parseFloat(yape)
    }

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
    if(day<10) day = "0" + day
    let month = d.getMonth() + 1
    if(month<10) month = "0" + month
    let year = d.getFullYear()
    let currentDate  =  `${year}-${month}-${day}`
    try{
        let storedIngresos = await pool.restaurante.query(`SELECT ingresos, Tarjeta, Yape FROM caja 
            WHERE cajero='${req.user.nombre}' AND date='${currentDate}' AND cerrar IS NULL LIMIT 1`);
        let efectivoGuardado = storedIngresos[0].ingresos
        let dineroDeTarjetaGuardado = storedIngresos[0].Tarjeta
        let yapeIngresosGuardados = storedIngresos[0].Yape
        let nuevosIngresosDeEfectivo = parseFloat(req.body.ingresos, 2)
        let nuevosIngresosDeTarjeta = parseFloat(req.body.tarjeta, 2)
        let nuevosIngresosDeYape = parseFloat(req.body.yape, 2)
        let ingresosDeDineroFisicoParaInsertar = efectivoGuardado + nuevosIngresosDeEfectivo
        let ingresosDeTarjetaParaInsertar = dineroDeTarjetaGuardado + nuevosIngresosDeTarjeta
        let ingresosYapeParaInsertar = yapeIngresosGuardados + nuevosIngresosDeYape
        await pool.restaurante.query(`UPDATE caja SET ingresos='${ingresosDeDineroFisicoParaInsertar}', Tarjeta='${ingresosDeTarjetaParaInsertar}', Yape='${ingresosYapeParaInsertar}'
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
    if(day<10) day = "0" + day
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