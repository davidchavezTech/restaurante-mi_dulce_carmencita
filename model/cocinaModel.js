const pool = require('../database')

const getOrders = async (req, res)=>{
    try{
        let ordenes = []
        let d = new Date();
        let day = d.getDate()
        let month = d.getMonth()
        let year = d.getFullYear()
        currentDate  =  `${day}_${month}_${year}`
        //get all the tables with the name of todays date--
        let result = await pool.pool_ordenes.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_NAME LIKE '${currentDate}%'`)
        if(result.length==0) return false
        for(let i=0;result.length>i;i++){
            let orden = await pool.pool_ordenes.query(`SELECT id, nombre_producto, cantidad, mesa, preparada  FROM ${result[i].TABLE_NAME}`);
            ordenes.push(orden)
        }
        res.json(ordenes)
    }catch(err){
        res.json(err)
    }
}

module.exports = {
    getOrders
}