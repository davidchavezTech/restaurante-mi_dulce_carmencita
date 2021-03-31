require('dotenv').config()

const express = require('express');
let router = express.Router();
const bcrypt = require('bcrypt')
const path = require('path');
const pool = require('../database')
const publicDirectory = path.join(__dirname, '../public')
const jwt = require('jsonwebtoken')

//Nos permite ver la info del formulario que se envió por <form></form>
router.use(express.urlencoded({ extended: true}));

router.get('/', async (req, res) => {

    res.render('loguearse', {title: 'Loguearse'});
    
});

router.get('/inicio', async (req, res) => {
    res.render('inicio', {title: 'Bienvenido'});
    
});

router.post('/login', async (req, res, next) => {

    const foundUser = await pool.query(`SELECT * FROM usuarios WHERE email = '${req.body.email}'`);
    const foundUsersEmail = foundUser[0].email
    const setPermission = foundUser[0].set_permission
    const foundUserspassword = foundUser[0].pwd
    if(foundUser){
        try{
            if(await bcrypt.compare(req.body.password, foundUserspassword)){
                
                //create the user object
                const user =  {email: foundUsersEmail,
                                permission: setPermission}

                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
                res.json({ accessToken: accessToken})
            }else{
                res.json('Not allowed')
            }
        }catch(error) {
            console.error(error);
          }
    }else{
        res.json('Not allowed')
    }
})

router.post('/inicio', isUserLoggedIn, async (req, res, next) => {
    
    if(req.user.permission=='e3h45'){
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
                            <td scope="row">${usuario.id}</td>
                            <td>${usuario.names}</td>
                            <td>${usuario.email}</td>
                            <td>${role}</td>
                            <td><input type='checkbox'></td>
                          </tr>
                            `
        })
        const headers = ['id', 'Nombres','Correo','Posición','']
        const responseObject = {
            permission: 'admin',
            headers,
            html
        } 
        res.json(responseObject)
    }else if(req.user.permission=='j5464'){
    
    
    }
})

router.post('/authenticate', isUserLoggedIn, (req, res) => {
    res.json('Correct JWT')
})

function isUserLoggedIn(req, res, next){
    const authHeader = req.body.headers.Authorization
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
        if (err) return res.send('Wrong token')
        req.user = user
        next()
    })
}
function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)

    // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
    //     if (err) return res.sendStatus(403)
    //     req.user = user
    //     next()
    // })
}
module.exports = router;