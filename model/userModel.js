const pool = require('../database')

const findUser = async (res, email)=>{
    try{
        let foundUser = await pool.restaurante.query(`SELECT * FROM usuarios WHERE email = '${email}'`);
        if(!(foundUser.length>0)){
            res.json(false)
        }else{
            return foundUser
        }
    }catch(err){
        res.json(err)
    }
}

module.exports = {
    findUser
}