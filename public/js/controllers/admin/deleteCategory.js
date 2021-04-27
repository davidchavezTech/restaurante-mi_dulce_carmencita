let camposIncorrectosDeleteCategoriaMsg = document.querySelector('#delete-category-error')
function deleteCategory(){
    let categoria = document.getElementById('delete-categorias-select').value
    camposIncorrectosDeleteCategoriaMsg.style.display = 'none'
    if(categoria=='') return camposIncorrectosDeleteCategoriaMsg.style.display = 'block'
    
    const data = {
        categoria,
        url: window.location.href,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer '+localStorageToken.accessToken
        },
    }
    $.post('/delete_category', data).done(( response ) => {
        deleteCategoryModal.style.display = 'none'
        console.log(response)
        // deleteCategory_emptyFields()
        loadPlatosCategorias()
        loadPlatos()
        displaySuccessMsg('Categoría eliminada exitosamente')
    })
}
// function deleteCategory_emptyFields(){
//     document.getElementById('delete-nombres-de-category-input').value = ''
// }