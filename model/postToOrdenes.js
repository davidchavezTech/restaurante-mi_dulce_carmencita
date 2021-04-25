const pool = require('../database')

const postPayment = async (res, data, name)=>{
    let mesaName = data.mesaName
    let efectivo = data.efectivo
    let tarjeta = data.tarjeta
    let yape = data.yape
    try{
        await pool.pool_ordenes.query(`UPDATE ${mesaName} SET procesada='1', cajero='${name}', efectivo='${efectivo}', tarjeta='${tarjeta}', yape='${yape}' WHERE id='1'`);
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
            WHERE cajero='${req.user.nombre}' AND date='${currentDate} cerrar IS NULL LIMIT 1'`);
        storedIngresos = storedIngresos[0].ingresos
        let nuevosIngresos = parseFloat(req.body.ingresos, 2)
        let ingresosParaInsertar = storedIngresos + nuevosIngresos
        await pool.restaurante.query(`UPDATE caja SET ingresos='${ingresosParaInsertar}'
        WHERE cajero='${req.user.nombre}' AND date='${currentDate} cerrar IS NULL LIMIT 1'`);
        res.json(true)
    }catch(err){
        res.json(err)
    }
}
module.exports = {
    postPayment,
    postNuevoIngresoAcaja
}