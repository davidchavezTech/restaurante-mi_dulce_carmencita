const pool = require('../database')
const { emit } = require('../utils/socket-io');


const resetDishToZero = async (req, res)=>{

    let meseroName = req.body.mesero.replace(/\s+/g, '').toLowerCase()
    let mesaID = req.body.mesaID

    let d = new Date();
    let day = d.getDate()
    if(day<10) day = "0" + day
    let month = d.getMonth() + 1
    if(month<10) month = "0" + month
    let year = d.getFullYear()

    let meseroTableName  =  `${day}_${month}_${year}_${meseroName}_${mesaID}`
    try{
        await pool.pool_meseros.query(`
            UPDATE ${meseroTableName} SET cantidad = 0 WHERE nombre_producto = '${req.body.plato}' 
        `)
        
        await pool.pool_ordenes.query(`
            UPDATE ${req.body.ordesrTableName} SET cantidad = 0 WHERE nombre_producto = '${req.body.plato}' 
        `)
    }catch(err){
        console.log(err)
    }
    res.json(true)
}

module.exports = {
    resetDishToZero
}