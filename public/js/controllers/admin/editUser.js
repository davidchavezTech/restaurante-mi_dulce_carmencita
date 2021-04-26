editar_camposIncorrectosMsg = document.querySelector('#editar-usuario-error')
function editUser(){
    let nombres = document.getElementById('editar-nombres-input').value
    let email = document.getElementById('editar-email-input').value
    let permission = document.getElementById('editar-permisos-select').value
    let contrasena = document.getElementById('editar-contrasena-input').value
    let confirmContrasena = document.getElementById('editar-contrasena-confirmar-input').value
    editar_camposIncorrectosMsg.style.display = 'none'
    if(nombres==''||email==''||permission==''||contrasena!=confirmContrasena) return camposIncorrectosMsg.style.display = 'block'
    
    const data = {
        nombres,
        email,
        permission,
        contrasena,
        userID,
        url: window.location.href,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer '+localStorageToken.accessToken
        },
    }
    $.post('/edit_user', data).done(( response ) => {
        document.querySelector('#editar-usuario-ya-existe').display = 'none'
        editUsermodal.style.display = 'none'
        editar_camposIncorrectosMsg .style.display = 'none'
        console.log(response)
        loadUsuarios()
        displaySuccessMsg('Usuario editado exitosamente')
    })
}
function createUser_emptyFields(){
    document.getElementById('editar-nombres-input').value = ''
    document.getElementById('editar-email-input').value = ''
    document.getElementById('editar-permisos-select').getElementsByTagName('option')[1].selected = 'selected'
    document.getElementById('editar-contrasena-input').value = ''
    document.getElementById('editar-contrasena-confirmar-input').value = ''
}