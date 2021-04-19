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
const cerrarCaja = async (res, name, date, monto, next)=>{
    try{
        let seAbrioCajaCon = await pool.restaurante.query(`UPDATE caja
        SET cerrar='${monto}'
        WHERE cajero = '${name}' AND date = '${date}' AND cerrar IS NULL LIMIT 1`);
        next()   
    }catch(err){
        console.log(err)
        res.json(err)
    }
}
module.exports = {
    aperturarCaja,
    findCaja,
    cerrarCaja
}