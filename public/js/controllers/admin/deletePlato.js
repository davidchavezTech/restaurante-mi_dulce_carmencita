function deletePlato(){
    const data = {
        platoID,
        url: window.location.href,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer '+localStorageToken.accessToken
        },
    }
    $.post('/delete_plato', data).done(( response ) => {
        if(response!=true)return console.log(response)
        loadPlatos()
        displaySuccessMsg('Producto eliminado correctamente')
    })
}