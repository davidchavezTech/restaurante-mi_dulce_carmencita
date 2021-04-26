function deleteUser(){
    const data = {
        userID,
        url: window.location.href,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer '+localStorageToken.accessToken
        },
    }
    $.post('/delete_user', data).done(( response ) => {
        if(response!=true)return console.log(response)
        createUser_emptyFields()
        loadUsuarios()
        displaySuccessMsg('Usuario eliminado correctamente')
    })
}