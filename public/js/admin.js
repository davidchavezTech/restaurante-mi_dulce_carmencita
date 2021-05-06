
let btns = document.getElementById("button");
let cancelMesaDeleteBtn = document.getElementById("cancel-mesa_delete");
let confirmMesaDeleteBtn = document.getElementById("confirm-mesa_delete");

this.addEventListener('click',(e)=>{
    clickedElement=e.target
    // console.log(clickedElement.type)
    if(clickedElement.classList.contains('nav-link')){
        navBarClicked(clickedElement)
    }else if(clickedElement.id==('excel-button')){
        showModalGenerarExcel(clickedElement)
    }else if(clickedElement.id == 'crearUsuario'){
        showModalCreateUser()
    }else if(clickedElement.id == 'eliminarUsuario'){
        showModalDeleteUser(clickedElement)
    }else if(clickedElement.id == 'editarUsuario'){
        showModalEditUser(clickedElement)
    }else if(clickedElement.id=='userPermissionSelect'){
        updatePermisoSelect(clickedElement)
    }else if(clickedElement.id=='platosCategorySelect'){
        updateCategoriaSelect(clickedElement)
    }else if(clickedElement.id=='platosCocinaSelect'){
        updatePlatoSelect(clickedElement)
    }else if(clickedElement.id=='edit-plato'){
        showModalEditPlato(clickedElement)
    }else if(clickedElement.id=='create-plato'){
        showModalCreatePlato(clickedElement)
    }else if(clickedElement.id=='delete-plato'){
        showModalDeletePlato(clickedElement)
    }else if(clickedElement.id=='create-categoria'){
        showModalCreateCategory(clickedElement)
    }else if(clickedElement.id=='delete-categoria'){
        showModalDeleteCategory(clickedElement)
    }else if(clickedElement.id=='confirm-generar_excel'){
        showModalGenerateExcel(clickedElement)
    }
})