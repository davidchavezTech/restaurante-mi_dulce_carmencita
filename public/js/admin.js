
let btns = document.getElementById("button");
let cancelMesaDeleteBtn = document.getElementById("cancel-mesa_delete");
let confirmMesaDeleteBtn = document.getElementById("confirm-mesa_delete");

this.addEventListener('click',(e)=>{
    clickedElement=e.target
    if(clickedElement.classList.contains('nav-link')){
        navBarClicked(clickedElement)
    }else if(clickedElement.classList.contains('btn-primary')){
        showModalGenerarExcel(clickedElement)
    }else if(clickedElement.id == 'crearUsuario'){
        showModalCreateUser()
    }else if(clickedElement.id == 'eliminarUsuario'){
        showModalDeleteUser(clickedElement)
    }else if(clickedElement.id == 'editarUsuario'){
        showModalEditUser(clickedElement)
    }
})