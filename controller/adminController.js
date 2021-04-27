const pool = require('../database')
const bcrypt = require('bcrypt')
const excelModel = require('../model/excelModel')

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


async function crearPlato(req, res){
    try{
        let result = await pool.restaurante.query(`
        SELECT * FROM productos WHERE nombre_producto='${req.body.nombre}' LIMIT 1`)
        if(result.length!=0) return res.json('Usuario ya existe')
        await pool.restaurante.query(`
        INSERT INTO productos (nombre_producto, precio_venta, costo, categoria)
        VALUES ('${req.body.nombre}', '${req.body.precio_de_venta}', '${req.body.costo_unitario_promedio}', '${req.body.categoria}');    
        `)
        res.json(true)
    }catch(err){
        console.log(err)
        res.json(err)
    }
    
}



async function createCategory(req, res){
    try{
        let result = await pool.restaurante.query(`
        SELECT * FROM categorias WHERE nombre_de_categoria='${req.body.nombre}' LIMIT 1`)
        if(result.length!=0) return res.json('Usuario ya existe')
        await pool.restaurante.query(`
        INSERT INTO categorias (nombre_de_categoria)
        VALUES ('${req.body.nombre}');    
        `)
        res.json(true)
    }catch(err){
        console.log(err)
        res.json(err)
    }
    
}


async function deleteCategory(req, res){
    try{
        await pool.restaurante.query(`
        DELETE FROM categorias WHERE nombre_de_categoria="${req.body.categoria}"
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


async function deletePlato(req, res){
    try{
        await pool.restaurante.query(`
            DELETE FROM productos WHERE id="${req.body.platoID}"
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
async function editPlato(req, res){
    try{
        await pool.restaurante.query(`
            UPDATE productos SET nombre_producto='${req.body.nombre_de_plato}', precio_venta='${req.body.precio_de_venta}', costo='${req.body.costo_unitario_promedio}', categoria='${req.body.categoria}' WHERE id='${req.body.platoID}'
        `)
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


// async function loadPermissions(req, res){
//     try{
//         let result = await pool.restaurante.query(`
//             SELECT nombre_de_categoria FROM categorias
//         `)
//         res.json(result)
//     }catch(err){
//         console.log(err)
//         res.json(err)
//     }
    
// }
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


async function updatePermission(req, res){
    try{
        await pool.restaurante.query(`
            UPDATE usuarios SET set_permission='${req.body.permission}' WHERE id='${req.body.userID}'
        `)
        res.json(true)
    }catch(err){
        console.log(err)
        res.json(err)
    }
    
}


async function updateCategoria(req, res){
    try{
        await pool.restaurante.query(`
            UPDATE productos SET categoria='${req.body.categoria}' WHERE id='${req.body.platoID}'
        `)
        res.json(true)
    }catch(err){
        console.log(err)
        res.json(err)
    }
    
}


async function getCategorias(req, res){
    try{
        result = await pool.restaurante.query(`
            SELECT nombre_de_categoria FROM categorias
        `)
        res.json(result)
    }catch(err){
        console.log(err)
        res.json(err)
    }
    
}

async function excel_rAtenciones(req, res){
    try{
        let ordenesTables = await pool.pool_ordenes.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_SCHEMA = 'ordenes'`)
        let correctTableNamesToReturn = []
        for(let i=0;ordenesTables.length>i;i++){
            var arr = req.body.dateRange.de.split("-"); 
            let de = arr[2]+'_'+arr[1]+'_'+arr[0]
            var arr2 = req.body.dateRange.hasta.split("-"); 
            let hasta = arr2[2]+'_'+arr2[1]+'_'+arr2[0]
            let currentTableName = ordenesTables[i].TABLE_NAME
            // remove _1 (id from table name at the end of it)
            currentTableName = currentTableName.substr(0, currentTableName.lastIndexOf("_"));
            // currentTableName = currentTableName.replace(/_/g,"-");
            if(de<=currentTableName&&hasta>=currentTableName){
                correctTableNamesToReturn.push(ordenesTables[i].TABLE_NAME)
            }
        }
        let response = []
        for(let i=0;correctTableNamesToReturn.length>i;i++){
            let result = await pool.pool_ordenes.query(`
                SELECT * FROM ${correctTableNamesToReturn[i]} WHERE id='1'
            `)
            response.push(result)
        }
        response.length > 0 ? res.json(response) : res.json(false)
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
    loadCategories,
    updatePermission,
    updateCategoria,
    getCategorias,
    editPlato,
    crearPlato,
    deletePlato,
    createCategory,
    deleteCategory,
    excel_rAtenciones
    // loadPermissions
}