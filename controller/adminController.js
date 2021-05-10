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
        INSERT INTO productos (nombre_producto, precio_venta, costo, categoria, cocina)
        VALUES ('${req.body.nombre}', '${req.body.precio_de_venta}', '${req.body.costo_unitario_promedio}', '${req.body.categoria}', '${req.body.cocina}');    
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
        if(result.length!=0) return res.json('Categoría ya existe')
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
            SELECT id, nombre_producto, precio_venta, costo, categoria, cocina FROM productos
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
async function updateCocina(req, res){
    try{
        await pool.restaurante.query(`
            UPDATE productos SET cocina='${req.body.cocina}' WHERE id='${req.body.platoID}'
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
                SELECT * FROM ${correctTableNamesToReturn[i]}
            `)
            for(let j=0;result.length>j;j++){
                result[j].created_at = result[j].created_at.toString()
                console.log(result[j].created_at)
            }
            response.push(result)
        }
        response.length > 0 ? res.json(response) : res.json(false)
    }catch(err){
        console.log(err)
        res.json(err)
    }
}


async function excel_rComandas(req, res){
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
            // 16.24
        }
        let response = []
        for(let i=0;correctTableNamesToReturn.length>i;i++){
            let result = await pool.pool_ordenes.query(`
                SELECT * FROM ${correctTableNamesToReturn[i]}
            `)
            for(let j=0;result.length>j;j++){
                result[j].created_at = result[j].created_at.toString()
                console.log(result[j].created_at)
            }
            response.push(result)
        }
        response.length > 0 ? res.json(response) : res.json(false)
    }catch(err){
        console.log(err)
        res.json(err)
    }
}


async function excel_rCaja(req, res){
    response = []
    try{
        let result = await pool.restaurante.query(`
                SELECT * FROM caja
            `)
        for(let i=0;result.length>i;i++){
            let splitDate = result[i].date.toString()
            splitDate = splitDate.split(' ')
            let month
            switch (splitDate[1]){
                case 'Jan':
                    month = '01'
                break
                case 'Feb':
                    month = '02'
                break
                case 'Mar':
                    month = '03'
                break
                case 'Apr':
                    month = '04'
                break
                case 'May':
                    month = '05'
                break
                case 'Jun':
                    month = '06'
                break
                case 'Jul':
                    month = '07'
                break
                case 'Aug':
                    month = '08'
                break
                case 'Sep':
                    month = '09'
                break
                case 'Oct':
                    month = 10
                break
                case 'Nov':
                    month = 11
                break
                case 'Dec':
                    month = 12
                break
            }
            switch (splitDate[1]){
                case 'Ene':
                    month = '01'
                break
                case 'Feb':
                    month = '02'
                break
                case 'Mar':
                    month = '03'
                break
                case 'Abr':
                    month = '04'
                break
                case 'May':
                    month = '05'
                break
                case 'Jun':
                    month = '06'
                break
                case 'Jul':
                    month = '07'
                break
                case 'Ago':
                    month = '08'
                break
                case 'Sep':
                    month = '09'
                break
                case 'Oct':
                    month = 10
                break
                case 'Nov':
                    month = 11
                break
                case 'Dec':
                    month = 12
                break
            }
            let date = `${splitDate[3]}-${month}-${splitDate[2]}`
            //Correct format is 2021-04-22
            function checkDateScope(de, dateToCompare, hasta){
                let deSplit = de.split('-')
                deSplit = deSplit.map(function(x) {
                    return parseInt(x)
                });
                let dateToCompareSplit = dateToCompare.split('-')
                dateToCompareSplit = dateToCompareSplit.map(function(x) {
                    return parseInt(x)
                });
                let hastaSplit = hasta.split('-')
                hastaSplit = hastaSplit.map(function(x) {
                    return parseInt(x)
                });
                for(let j=0;hastaSplit.length>j;j++){
                    if(!(deSplit[j]<=dateToCompareSplit[j])){
                        return false
                    }
                }
                for(let j=0;hastaSplit.length>j;j++){
                    if(!(hastaSplit[j]>=dateToCompareSplit[j])){
                        return false
                    }
                }
                return true
            }

            if(checkDateScope(req.body.dateRange.de, date, req.body.dateRange.hasta)){
                response.push(result[i])
            }
        }
        response.length > 0 ? res.json(response) : res.json(false)
    }catch(err){
        console.log(err)
        res.json(false)
    }
}

async function excel_rProductos(req, res){
    try{
        let listaDeProdutos = await pool.restaurante.query(`SELECT nombre_producto, precio_venta, costo, categoria, cocina FROM productos`)
        let nombres_de_todas_las_mesas = await pool.pool_ordenes.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_SCHEMA = 'ordenes'
        `)
        let nombres_de_mesas_para_seleccionar = []
        for(let i=0;nombres_de_todas_las_mesas.length>i;i++){
            var arr = req.body.dateRange.de.split("-"); 
            let de = arr[2]+'_'+arr[1]+'_'+arr[0]
            var arr2 = req.body.dateRange.hasta.split("-"); 
            let hasta = arr2[2]+'_'+arr2[1]+'_'+arr2[0]
            let currentTableName = nombres_de_todas_las_mesas[i].TABLE_NAME
            // remove _1 (id from table name at the end of it)
            currentTableName = currentTableName.substr(0, currentTableName.lastIndexOf("_"));
            // currentTableName = currentTableName.replace(/_/g,"-");
            if(de<=currentTableName&&hasta>=currentTableName){
                nombres_de_mesas_para_seleccionar.push(nombres_de_todas_las_mesas[i].TABLE_NAME)
            }
        }
        //add property quantity to listaDeProdutos

        for(let i=0;listaDeProdutos.length>i;i++){
            listaDeProdutos[i].quantity = 0
        }

        for(let i=0;nombres_de_mesas_para_seleccionar.length>i;i++){
            let result = await pool.pool_ordenes.query(`
                SELECT nombre_producto, cantidad, cancelada_pagada FROM ${nombres_de_mesas_para_seleccionar[i]}
            `)
            for(let j=1;result.length>j;j++){
                console.log(j)
                let nombreDelProducto = result[j].nombre_producto
                let cancelada_pagada = result[j].cancelada_pagada
                let qty = result[j].cantidad
                if(cancelada_pagada==1){
                    for(let k=0;listaDeProdutos.length>k;k++){
                        if(listaDeProdutos[k].nombre_producto==nombreDelProducto) {
                            listaDeProdutos[k].quantity += qty
                        }
                    }
                }
            }
        }
        listaDeProdutos.length > 0 ? res.json(listaDeProdutos) : res.json(false)
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
    excel_rAtenciones,
    excel_rComandas,
    excel_rCaja,
    excel_rProductos,
    updateCocina
    // loadPermissions
}