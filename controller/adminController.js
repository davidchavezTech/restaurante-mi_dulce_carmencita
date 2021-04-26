const pool = require('../database')
const bcrypt = require('bcrypt')
async function getUsers(req, res){
    let result = await pool.restaurante.query(`
        SELECT id, names, email, set_permission FROM usuarios`)
    if(result.length==0) return
    res.json(result)
}


async function creatUser(req, res){
    try{
        let result = await pool.restaurante.query(`
        SELECT * FROM usuarios WHERE email='${req.body.email}'`)
        if(result.length!=0) return res.json('Usuario ya existe')
        let pwd = req.body.contrasena
        const hashedPassword = await bcrypt.hash(pwd, 10)
        await pool.restaurante.query(`
        INSERT INTO usuarios (names, email, pwd, set_permission)
        VALUES ('${req.body.nombres}', '${req.body.email}', '${hashedPassword}', '${req.body.permission}');    
        `)
        res.json(true)
    }catch(err){
        console.log(err)
        res.json(err)
    }
    
}


async function deleteUser(req, res){
    try{
        await pool.restaurante.query(`
            DELETE FROM usuarios WHERE id="${req.body.userID}"
        `)
        res.json(true)
    }catch(err){
        console.log(err)
        res.json(err)
    }
    
}


async function editUser(req, res){
    try{
        
        if(req.body.contrasena){
            let pwd = req.body.contrasena
            const hashedPassword = await bcrypt.hash(pwd, 10)
            await pool.restaurante.query(`
                UPDATE usuarios SET names='${req.body.nombres}', email='${req.body.email}', pwd='${hashedPassword}', set_permission='${req.body.permission}' WHERE id='${req.body.userID}'
            `)
        }else{
            await pool.restaurante.query(`
                UPDATE usuarios SET names='${req.body.nombres}', email='${req.body.email}', set_permission='${req.body.permission}' WHERE id='${req.body.userID}'
            `)
        }
        res.json(true)
    }catch(err){
        console.log(err)
        res.json(err)
    }
    
}


async function loadPlatos(req, res){
    try{
        let result = await pool.restaurante.query(`
            SELECT id, nombre_producto, precio_venta, costo, categoria FROM productos
        `)
        res.json(result)
    }catch(err){
        console.log(err)
        res.json(err)
    }
    
}


async function loadCategories(req, res){
    try{
        let result = await pool.restaurante.query(`
            SELECT nombre_de_categoria FROM categorias
        `)
        res.json(result)
    }catch(err){
        console.log(err)
        res.json(err)
    }
    
}

module.exports = {
    getUsers,
    creatUser,
    deleteUser,
    editUser,
    loadPlatos,
    loadCategories
}