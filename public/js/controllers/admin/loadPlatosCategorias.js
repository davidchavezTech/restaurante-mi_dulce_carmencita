categoriasSelect = document.querySelector('#editar-categorias-select')

function loadPlatosCategorias(){
    let data = {
        url: window.location.href,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer '+localStorageToken.accessToken
        },
    }
    $.post('/admin-get_platos_categorias', data).done(( response ) => {
        let options = ''
        for(let i=0;response.length>i;i++){
            options += `<option value="${response[i].nombre_de_categoria}">${response[i].nombre_de_categoria}</option>`
        }
        document.getElementById('editar-categorias-select').innerHTML = options
        document.getElementById('crear-categorias-select').innerHTML = options
        document.getElementById('delete-categorias-select').innerHTML = options
    })
}loadPlatosCategorias()