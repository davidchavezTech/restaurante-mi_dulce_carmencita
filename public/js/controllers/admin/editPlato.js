let editarPlato_camposIncorrectosMsg = document.querySelector('#editar-plato-error')
function editPlato(){
    let nombre_de_plato = document.getElementById('editar-nombres-de-plato-input').value
    let precio_de_venta = document.getElementById('editar-precio_de_venta-input').value
    let costo_unitario_promedio = document.getElementById('editar-costo_unitario_promedio-input').value
    let categoria    = document.getElementById('editar-categorias-select').value
    editarPlato_camposIncorrectosMsg.style.display = 'none'
    if(nombre_de_plato==''||precio_de_venta==''||costo_unitario_promedio=='') return camposIncorrectosMsg.style.display = 'block'
    
    const data = {
        nombre_de_plato,
        precio_de_venta,
        costo_unitario_promedio,
        platoID,
        categoria,
        url: window.location.href,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer '+localStorageToken.accessToken
        },
    }
    $.post('/edit_plato', data).done(( response ) => {
        editPlatoModal.style.display = 'none'
        editarPlato_camposIncorrectosMsg .style.display = 'none'
        console.log(response)
        loadPlatos()
        displaySuccessMsg('Plato editado exitosamente')
    })
}
// function createUser_emptyFields(){
//     document.getElementById('editar-nombres-input').value = ''
//     document.getElementById('editar-email-input').value = ''
//     document.getElementById('editar-permisos-select').getElementsByTagName('option')[1].selected = 'selected'
//     document.getElementById('editar-contrasena-input').value = ''
//     document.getElementById('editar-contrasena-confirmar-input').value = ''
// }