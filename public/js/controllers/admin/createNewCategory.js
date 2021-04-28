let camposIncorrectosCrearCategoriaMsg = document.querySelector('#crear-category-error')
function createNewCategory(){
    let nombre = document.getElementById('crear-nombres-de-category-input').value
    camposIncorrectosCrearCategoriaMsg.style.display = 'none'
    if(nombre=='') return camposIncorrectosCrearCategoriaMsg.style.display = 'block'
    
    const data = {
        nombre,
        url: window.location.href,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer '+localStorageToken.accessToken
        },
    }
    $.post('/create_new_category', data).done(( response ) => {
        if(response=='Categoría ya existe') return document.querySelector('#crear-category-ya-existe').style.display = 'block'
        document.querySelector('#crear-category-ya-existe').display = 'none'
        createCategoryModal.style.display = 'none'
        camposIncorrectosCrearCategoriaMsg.style.display = 'none'
        console.log(response)
        createCategory_emptyFields()
        loadPlatosCategorias()
        loadPlatos()
        displaySuccessMsg('Categoría creada exitosamente')
    })
}
function createCategory_emptyFields(){
    document.getElementById('crear-nombres-de-category-input').value = ''
}