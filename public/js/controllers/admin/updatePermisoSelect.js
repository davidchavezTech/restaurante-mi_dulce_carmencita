function updatePermisoSelect(clickedElement){
    clickedElement.addEventListener('change', (e)=>{
        let userID = e.target.closest('tr').id

        let data = {
            url: window.location.href,
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer '+localStorageToken.accessToken
            },
            userID,
            permission: e.target.value
        }
        $.post('/admin-update_permission', data).done(( response ) => {
            if(response !== true)console.log(response)
            else if(response === true) displaySuccessMsg('Permiso actualizado')
        })
    })
}