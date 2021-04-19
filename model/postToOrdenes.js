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
module.exports = {
    postPayment
}