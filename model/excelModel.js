const pool = require('../database')

const excel_rAtenciones2 = async (req, res)=>{
    try{
        result = await pool.restaurante.query(`
            SELECT * FROM ordenes WHERE date_column >= '${dateRange[0]}' AND date_column <= '${dateRange[1]}'
        `)
        res.json(result)
    }catch(err){
        console.log(err)
        res.json(err)
    }
}
module.exports = {
    excel_rAtenciones2
}