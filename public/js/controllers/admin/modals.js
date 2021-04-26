let excelModal = document.getElementById("myModal");
let modalTitle = document.getElementById('modal-title')
let spanClose = document.querySelector('.close')


function showModalGenerarExcel(clickedElement){
    let text = clickedElement.textContent
    modalTitle.textContent= 'Generar ' + text.toLowerCase();
    excelModal.style.display = 'block'
}
spanClose.addEventListener('click', ()=>{
    excelModal.style.display = 'none'
})
//--------------------CREATE USER MODAL-----------------------

let createUsermodal = document.getElementById('CreateNewUserModal')
let cancel_createUserBtn = document.getElementById('cancel-editar_usuario')
let confirm_createUserBtn = document.getElementById('confirm-editar_usuario')

function showModalCreateUser(){
    createUsermodal.style.display = 'block'
}
cancel_createUserBtn.addEventListener('click',()=>{
    createUsermodal.style.display = 'none'
})

confirm_createUserBtn.addEventListener('click',()=>{
    editUser()
})

//--------------------EDIT USER MODAL-----------------------

let editUsermodal = document.getElementById('EditUserModal')
let cancel_editUserBtn = document.getElementById('cancel-editar_usuario')
let confirm_editUserBtn = document.getElementById('confirm-editar_usuario')

function showModalEditUser(clickedElement){
    userID = clickedElement.closest('tr').id
    let nombres = clickedElement.closest('tr').children[0].textContent
    let email = clickedElement.closest('tr').children[1].textContent
    let permiso = clickedElement.closest('tr').children[2].children[0].value
    document.getElementById('editar-nombres-input').value = nombres
    document.getElementById('editar-email-input').value = email
    document.getElementById('editar-permisos-select').value = permiso
    document.getElementById('editar-contrasena-input').value = ''
    document.getElementById('editar-contrasena-confirmar-input').value = ''
    editUsermodal.style.display = 'block'
}
cancel_editUserBtn.addEventListener('click',()=>{
    editUsermodal.style.display = 'none'
})

confirm_editUserBtn.addEventListener('click',()=>{
    editUser()
})

//--------------------DELETE USER MODAL-----------------------

let deleteUsermodal = document.getElementById('deleteUserModal')
let cancel_deleteUserBtn = document.getElementById('delete_user-cancel_button')
let confirm_deleteUserBtn = document.getElementById('delete_user-confirm_button')
let nombreUsuarioContainer = document.getElementById('nombreDeUsuarioContainer')

let userID
function showModalDeleteUser(clickedElement){
    userID = clickedElement.closest('tr').id
    deleteUsermodal.style.display = 'block'
    nombreUsuarioContainer.textContent = clickedElement.closest('tr').children[0].textContent
}
cancel_deleteUserBtn.addEventListener('click',()=>{
    deleteUsermodal.style.display = 'none'
})

confirm_deleteUserBtn.addEventListener('click',()=>{
    deleteUser()
    deleteUsermodal.style.display = 'none'
})

