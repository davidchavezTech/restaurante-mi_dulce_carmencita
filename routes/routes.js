const express = require('express');
let router = express.Router();
const path = require('path');
const pool = require('../database')
const publicDirectory = path.join(__dirname, '../public')

//Nos permite ver la info del formulario que se envió por <form></form>
router.use(express.urlencoded({ extended: true}));

router.get('/', async (req, res) => {
    // let result = await pool.query('SELECT * FROM categories');
    // console.log(result)
    res.render('loguearse', {title: 'Loguearse'});
    
});

router.get('/inicio', async (req, res) => {
    res.render('inicio', {title: 'Bienvenido'});
    
});

router.post('/login', async (req, res, next) => {

    
    let result = await pool.query(`SELECT * FROM usuarios WHERE email = '${req.body.email}' AND pwd = '${req.body.password}'`);
    console.log(result[0])
    if(result[0]){
        res.json(result[0])
    }else{
        res.json('wrong')
    }
    
    // console.log(res)
})

router.post('/inicio', async (req, res, next) => {
    
    if(req.body.permission=='e3h45'){
        let result = await pool.query(`SELECT * FROM usuarios`);
        let html = ''
        result.forEach(usuario =>{
            let role
            switch (usuario.set_permission) {
                case 'e3h45':
                    role='Administrador'
                    break
                case 'j5464':
                    role='Mesero'
                    break
                case '34n34':
                    role='cajero'
                    break
                case '45bui':
                    role='Cocina'
                    break
            }
            html = html + `<tr>
                            <td>${usuario.id}</td>
                            <td>${usuario.names}</td>
                            <td>${usuario.email}</td>
                            <td>${role}</td>
                            <td><input type='checkbox'></td>
                          </tr>
                            `
        })
        
        res.json(html)
    }
    
})

module.exports = router;