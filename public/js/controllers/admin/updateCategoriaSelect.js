function updateCategoriaSelect(clickedElement){
    clickedElement.addEventListener('change', (e)=>{
        let platoID = e.target.closest('tr').id

        let data = {
            url: window.location.href,
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer '+localStorageToken.accessToken
            },
            platoID,
            categoria: e.target.value
        }
        $.post('/admin-update_categoria', data).done(( response ) => {
            if(response !== true)console.log(response)
            else if(response === true) displaySuccessMsg('Categoria actualizada')
        })
    })
}
function updatePlatoSelect(clickedElement){
    clickedElement.addEventListener('change', (e)=>{
        let platoID = e.target.closest('tr').id

        let data = {
            url: window.location.href,
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer '+localStorageToken.accessToken
            },
            platoID,
            cocina: e.target.value
        }
        $.post('/admin-update_cocina', data).done(( response ) => {
            if(response !== true)console.log(response)
            else if(response === true) displaySuccessMsg('Cocina actualizada')
        })
    })
}