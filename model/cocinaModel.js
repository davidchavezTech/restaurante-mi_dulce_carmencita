const pool = require('../database')

const getOrders = async (req, res)=>{
    try{
        let ordenes = []
        let d = new Date();
        let day = d.getDate()
        if(day<10) day="0"+day
        let month = d.getMonth() + 1
        if(month<10) month="0"+month
        let year = d.getFullYear()
        currentDate  =  `${day}_${month}_${year}`
        //get all the tables with the name of todays date--
        let result = await pool.pool_ordenes.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_NAME LIKE '${currentDate}%' AND TABLE_SCHEMA = 'ordenes'
        `)
        if(result.length==0) return false
        for(let i=0;result.length>i;i++){
            let orden = await pool.pool_ordenes.query(`SELECT id, nombre_producto, cantidad, mesero, mesa, preparada, cocina FROM ${result[i].TABLE_NAME}`);
            //only push this to the array that will be sent back if the state set by the request matches the one in the data base =>preparada 0 or preparada 1
            if(orden[0].preparada==req.body.state)ordenes.push(orden)
        }
        res.json(ordenes)
    }catch(err){
        res.json(err)
    }
}


const procesarOrden = async(req, res)=>{
    try{
        await pool.pool_ordenes.query(`UPDATE ${req.body.tableName} SET preparada='1'`)
        res.json('La orden se procesó correctamente')
    }catch(err){
        res.json(false)
    }
}
const setStock = async (req, res)=>{
    try{
        await pool.restaurante.query(`UPDATE productos SET stock='${req.body.stock}' WHERE id='${req.body.ID}'`)
        res.json(true)
    }catch(err){
        console.log(err)
        res.json(false)
    }
}
module.exports = {
    getOrders,
    procesarOrden,
    setStock
}