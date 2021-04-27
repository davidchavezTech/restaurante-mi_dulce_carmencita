camposIncorrectosMsg = document.querySelector('#crear-plato-error')
function createNewPlato(){
    let nombre = document.getElementById('crear-nombres-de-plato-input').value
    let precio_de_venta = document.getElementById('crear-precio_de_venta-input').value
    let costo_unitario_promedio = document.getElementById('crear-costo_unitario_promedio-input').value
    let categoria = document.getElementById('crear-categorias-select').value
    camposIncorrectosMsg.style.display = 'none'
    if(nombre==''||precio_de_venta==''||costo_unitario_promedio==''||categoria=='') return camposIncorrectosMsg.style.display = 'block'
    
    const data = {
        nombre,
        precio_de_venta,
        costo_unitario_promedio,
        categoria,
        url: window.location.href,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer '+localStorageToken.accessToken
        },
    }
    $.post('/create_new_plato', data).done(( response ) => {
        if(response=='Plato ya existe') return document.querySelector('#crear-plato-ya-existe').style.display = 'block'
        document.querySelector('#crear-plato-ya-existe').display = 'none'
        createPlatoModal.style.display = 'none'
        camposIncorrectosMsg.style.display = 'none'
        console.log(response)
        createPlato_emptyFields()
        loadPlatos()
        displaySuccessMsg('Plato creado exitosamente')
    })
}
function createPlato_emptyFields(){
    document.getElementById('crear-nombres-de-plato-input').value = ''
    document.getElementById('crear-precio_de_venta-input').value = ''
    document.getElementById('crear-costo_unitario_promedio-input').value = ''
    document.getElementById('crear-categorias-select').getElementsByTagName('option')[1].selected = 'selected'
}