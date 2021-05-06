let excelModal = document.getElementById("myModal");
let modalTitle = document.getElementById('modal-title')
let spanClose = document.querySelector('.close')
let excel_cancelBtn = document.querySelector('#cancel-generar_excel')
let variable_textoDeBoton

excel_cancelBtn.addEventListener('click', ()=>{
    excelModal.style.display = 'none'
    document.querySelector('#error-excel').style.display = 'none'
    document.querySelector('#de').value = ''
    document.querySelector('#hasta').value = ''
})
function showModalGenerarExcel(clickedElement){
    variable_textoDeBoton = clickedElement.textContent
    let text = clickedElement.textContent
    modalTitle.textContent= 'Generar ' + text.toLowerCase();
    excelModal.style.display = 'block'
}
spanClose.addEventListener('click', ()=>{
    excelModal.style.display = 'none'
})
//--------------------MODAL - CREATE USER -----------------------

let createUsermodal = document.getElementById('CreateNewUserModal')
let cancel_createUserBtn = document.getElementById('cancel-crear_usuario')
let confirm_createUserBtn = document.getElementById('confirm-crear_usuario')

function showModalCreateUser(){
    createUsermodal.style.display = 'block'
}
cancel_createUserBtn.addEventListener('click',()=>{
    createUsermodal.style.display = 'none'
})

confirm_createUserBtn.addEventListener('click',()=>{
    createNewUser()
})

//--------------------MODAL - EDIT USER -----------------------

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

//--------------------MODAL - DELETE USER -----------------------

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

//--------------------MODAL - EDIT PLATO -----------------------

let editPlatoModal = document.getElementById('EditPlatoModal')
let cancel_editPlatoBtn = document.getElementById('cancel-editar_plato')
let confirm_editPlatoBtn = document.getElementById('confirm-editar_plato')

let platoID
function showModalEditPlato(clickedElement){
    platoID = clickedElement.closest('tr').id
    let nombre_de_plato = clickedElement.closest('tr').children[0].textContent
    let precio_venta = clickedElement.closest('tr').children[1].textContent
    let costo_unitario_promedio = clickedElement.closest('tr').children[2].textContent
    let categoria = clickedElement.closest('tr').children[3].children[0].value
    document.getElementById('editar-nombres-de-plato-input').value = nombre_de_plato
    document.getElementById('editar-precio_de_venta-input').value = precio_venta
    document.getElementById('editar-costo_unitario_promedio-input').value = costo_unitario_promedio
    document.getElementById('editar-categorias-select').value = categoria
    editPlatoModal.style.display = 'block'
}
cancel_editPlatoBtn.addEventListener('click',()=>{
    editPlatoModal.style.display = 'none'
})

confirm_editPlatoBtn.addEventListener('click',()=>{
    editPlato()
})

//--------------------MODAL - CREATE PLATO -----------------------


let createPlatoModal = document.getElementById('crearPlatoModal')
let cancel_createPlatoBtn = document.getElementById('cancel-crear_plato')
let confirm_createPlatoBtn = document.getElementById('confirm-crear_plato')

function showModalCreatePlato(){
    createPlatoModal.style.display = 'block'
}
cancel_createPlatoBtn.addEventListener('click',()=>{
    createPlatoModal.style.display = 'none'
})

confirm_createPlatoBtn.addEventListener('click',()=>{
    createNewPlato()
})

//--------------------MODAL - CREATE CATEGORY -----------------------


let createCategoryModal = document.getElementById('crearcategoryModal')
let cancel_createCategoryBtn = document.getElementById('cancel-crear_category')
let confirm_createCategoryBtn = document.getElementById('confirm-crear_category')

function showModalCreateCategory(){
    createCategoryModal.style.display = 'block'
}
cancel_createCategoryBtn.addEventListener('click',()=>{
    createCategoryModal.style.display = 'none'
})

confirm_createCategoryBtn.addEventListener('click',()=>{
    createNewCategory()
})

//--------------------MODAL - DELETE CATEGORY -----------------------


let deleteCategoryModal = document.getElementById('deleteCategoryModal')
let cancel_deleteCategoryBtn = document.getElementById('cancel-delete_category')
let confirm_deleteCategoryBtn = document.getElementById('confirm-delete_category')

function showModalDeleteCategory(){
    deleteCategoryModal.style.display = 'block'
}
cancel_deleteCategoryBtn.addEventListener('click',()=>{
    deleteCategoryModal.style.display = 'none'
})

confirm_deleteCategoryBtn.addEventListener('click',()=>{
    deleteCategory()
})

//--------------------MODAL - DELETE PLATO -----------------------

let deletePlatomodal = document.getElementById('deletePlatoModal')
let cancel_deletePlatoBtn = document.getElementById('delete_plato-cancel_button')
let confirm_deletePlatoBtn = document.getElementById('delete_plato-confirm_button')
let nombrePlatoContainer = document.getElementById('nombreDePlatoContainer')

function showModalDeletePlato(clickedElement){
    platoID = clickedElement.closest('tr').id
    deletePlatomodal.style.display = 'block'
    nombrePlatoContainer.textContent = clickedElement.closest('tr').children[0].textContent
}
cancel_deletePlatoBtn.addEventListener('click',()=>{
    deletePlatomodal.style.display = 'none'
})

confirm_deletePlatoBtn.addEventListener('click',()=>{
    deletePlato()
    deletePlatomodal.style.display = 'none'
})