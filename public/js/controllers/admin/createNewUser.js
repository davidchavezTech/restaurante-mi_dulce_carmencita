camposIncorrectosMsg = document.querySelector('#crear-usuario-error')
function createNewUser(){
    let nombres = document.getElementById('crear-nombres-input').value
    let email = document.getElementById('crear-email-input').value
    let permission = document.getElementById('crear-permisos-select').value
    let contrasena = document.getElementById('crear-contrasena-input').value
    let confirmContrasena = document.getElementById('crear-contrasena-confirmar-input').value
    camposIncorrectosMsg.style.display = 'none'
    if(nombres==''||email==''||permission==''||contrasena==''||confirmContrasena==''||contrasena!=confirmContrasena) return camposIncorrectosMsg.style.display = 'block'
    
    const data = {
        nombres,
        email,
        permission,
        contrasena,
        url: window.location.href,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer '+localStorageToken.accessToken
        },
    }
    $.post('/create_new_user', data).done(( response ) => {
        if(response=='Usuario ya existe') return document.querySelector('#crear-usuario-ya-existe').style.display = 'block'
        document.querySelector('#crear-usuario-ya-existe').display = 'none'
        createUsermodal.style.display = 'none'
        camposIncorrectosMsg.style.display = 'none'
        console.log(response)
        document.getElementById('crear-nombres-input').value = ''
        document.getElementById('crear-email-input').value = ''
        document.getElementById('crear-permisos-select').getElementsByTagName('option')[0].selected = 'selected'
        document.getElementById('crear-contrasena-input').value = ''
        document.getElementById('crear-contrasena-confirmar-input').value = ''
        loadUsuarios()
        displaySuccessMsg('Usuario creado exitosamente')
    })
}
function createUser_emptyFields(){
    debugger
    document.getElementById('crear-nombres-input').value = ''
    document.getElementById('crear-email-input').value = ''
    document.getElementById('crear-permisos-select').getElementsByTagName('option')[0].selected = 'selected'
    document.getElementById('crear-contrasena-input').value = ''
    document.getElementById('crear-contrasena-confirmar-input').value = ''
}