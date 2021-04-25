let container = document.getElementById('comanda-selected')
let comandas_container = document.querySelector('#comanda_container')
let mesaID
let mesaNumberSpan = document.querySelector('#mesa_number')
let miNombre
let savedClickedElement


let mesasData = {
    url: window.location.href,
    type: 'POST',
    contentType: 'application/json',
    headers: {
        'Authorization': 'Bearer '+localStorageToken.accessToken
    }
}
$.post('/mesero-load_tables', mesasData).done(( data ) => {
    console.log(data)
    //create mesas orders from server's response
    for(i=0;data.length>i;i++){

        let mesaNumber = data[i][0]
        let div = document.createElement('div')
        div.id = mesaNumber
        div.classList.add('mesa_container')
        div.setAttribute('mesero-mesa_name', data[i][1])
        // switch (mesaNumber) {
        //     case 1:
        //         mesaNumber = '01';
        //         break;
        //     case 2:
        //         mesaNumber = '02';
        //         break;
        //     case 3:
        //         mesaNumber = '03';
        //         break;
        //     case 4:
        //         mesaNumber = '04';
        //         break;
        //     case 5:
        //         mesaNumber = '05';
        //         break;
        //     case 6:
        //         mesaNumber = '06';
        //         break;
        //     case 7:
        //         mesaNumber = '07';
        //         break;
        //     case 8:
        //         mesaNumber = '08';
        //         break;
        //     case 9:
        //         mesaNumber = '09';
        //         break;
        // }
        //Let's generate the html we will insert into <tbody> for each order
        let trs = ''
        let total = 0
        for(let j=2;data[i].length>j;j++){
            let qnt = parseFloat(data[i][j].cantidad, 2)
            let price = parseFloat(data[i][j].precio, 2)
            total+=qnt*price
            trs += `<tr id="orden">
                <td class="hidden">${data[i][j].id}</td>
                <td style="padding-top:15px;">${data[i][j].nombre_producto}</td>
                <td class="text-align-center" style="padding-top:15px;">${data[i][j].cantidad}</td>
                <td class="text-align-center" style="padding-top:15px;">${data[i][j].precio}</td>
                <td class="hidden cat-selector">${data[i][j].stock}</td>
                <td class="hidden">1</td>
            </tr>`
        }
        let grayedOut = ''
        let display = ''
        if(data[i][2]){
            if(data[i][2].delivery_state==1){
                grayedOut = 'gray-out'
                display=' hidden'
            }else{
                 grayedOut = ''
            }
        }
        div.innerHTML = `
        <div class="comanda-title ${grayedOut}">
            <span id="${mesaNumber}" class="mesa">Mesa ${mesaNumber}</span>
            <img src="img/expand_arrow.svg" class="expand_arrow">
        </div>
        <div class="comanda-info">
            <table class="comanda_table">
                <thead class="color-thead">
                    <tr class="comanda-row">
                        <th class="hidden">id</th>
                        <th>Producto</th>
                        <th>cantidad</th>
                        <th class="text-align-center">Precio</th>
                        <th class="hidden">Categoría</th>
                        <th class="hidden">stock</th>
                    </tr>
                </thead>
                <tbody id="main_tbody">
                    ${trs}
                </tbody>
            </table>
            <div class="space-between">
                <div class="total-container">
                    <h1 style="display:inline-block">Total:&nbsp;&nbsp; </h1><span id="precio_total">${total}</span>
                </div>
                <div>
                    <img src="img/check.svg" class="check${display}" alt="">
                    <img src="img/delete.svg" class="trashcan" alt="">
                </div>
            </div>
        </div>
        `
        comandas_container.append(div)
    }
})

$("#main_table").on("click", "tr", function(e) {
    let orig = $(e.currentTarget)[0]
    if(orig.id == 'main_thead-tr') {return}
    if(orig.children[5].textContent == 0) {return}
    let clickedRowID = orig.children[0].textContent
    let copy = orig.cloneNode(true);
    //make quantity visible
    copy.children[2].classList.remove('hidden')
    //check if we selected a mesa
    if(container.children.length!=0){
        let containerTableRows = container.children[0].children[1].children[0].children[1]
        //check if selected mesa is empty
        if(containerTableRows.children.length!=0){//not empty, has rows in it, cont
            let gotAmatch = false
            for(let i=0;containerTableRows.children.length>i;i++){//check if already added, if so, add one more to quantity
                let idForRowBeenSearched = containerTableRows.children[i].children[0].textContent
                if(clickedRowID==idForRowBeenSearched){//got a match!
                    let currentQuantity = containerTableRows.children[i].children[2].textContent
                    currenQuantity = parseFloat(currentQuantity, 2)
                    let newQuantity = currenQuantity + 1
                    containerTableRows.children[i].children[2].textContent = newQuantity
                    gotAmatch = true
                    i=containerTableRows.children.length
                    agregarCantidaDePlatoaDDBB(orig.children[0].textContent, newQuantity)
                }
            }if(!gotAmatch){
                agregarPlatoaDDBB(orig)
                //append the copied <tr>
                container.children[0].children[1].children[0].children[1].append(copy)
                i=containerTableRows.children.length
            }
        }else{//no platos selected, just append the copied <tr> and don't search if already in there
            //append TR copy
            agregarPlatoaDDBB(orig)
            container.children[0].children[1].children[0].children[1].append(copy)
        }
        //Get the total from all platos selected
        let completeTotal = 0
        for(let i=0;containerTableRows.children.length>i;i++){
            let quantity = containerTableRows.children[i].children[2].textContent
            let precio = containerTableRows.children[i].children[3].textContent
            quantity = parseInt(quantity)
            precio = parseFloat(precio, 2)
            let currentTotal = quantity*precio
            completeTotal = completeTotal + currentTotal
        }
        document.querySelector('#precio_total').textContent = completeTotal
        
        //add the color effect of adding element
        //add glow effect
        if(container.children[0].children[0].classList.contains('new_element_added')){
            container.children[0].children[0].classList.remove('new_element_added')
            setTimeout(() => {
                container.children[0].children[0].classList.add('new_element_added')
            }, 100);
        }else{
            container.children[0].children[0].classList.add('new_element_added')
        }
        //check if mesa container is expanded or not
        if(container.children[0].children[0].children[1].src=='http://localhost:4000/img/contract_arrow.svg'){
            //it's expanded, make it grow as mesero adds to the order
            //34 px is the height of the "mesa #..." header, plus size for trashcan
            let tableCurrentSize = container.children[0].children[1].children[0].offsetHeight
            let newHeight = tableCurrentSize + 60
            container.children[0].children[1].style.maxHeight = newHeight + "px";
        }
    }else{
        showError('No tiene ninguna mesa seleccionada')
    }
});
function agregarPlatoaDDBB(orig){
    //save it to DDBB
        
    let orderID = orig.children[0].textContent
    let nombre_producto = orig.children[1].textContent
    let cantidad = orig.children[2].textContent
    let precio = orig.children[3].textContent
    let categoria = orig.children[4].textContent
    let stock = orig.children[5].textContent
    const data = {
        url: window.location.href,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer '+localStorageToken.accessToken
        },
        orden:{
            mesaName:container.children[0].getAttribute('mesero-mesa_name'),
            id:orderID,
            nombre_producto,
            cantidad,
            precio,
            categoria,
            stock
        }
    }
    $.post('/mesero-agregar_plato_a_orden', data).done(( data ) => {
        console.log(data)
    })
}
function dropPlatoFromDDBB(tr){
    //save it to DDBB
        
    let orderID = tr.children[0].textContent
    const data = {
        url: window.location.href,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer '+localStorageToken.accessToken
        },
        orden:{
            mesaName:container.children[0].getAttribute('mesero-mesa_name'),
            id:orderID,
        }
    }
    $.post('/mesero-drop_dish_from_order', data).done(( data ) => {
        console.log(data)
    })
}
function agregarCantidaDePlatoaDDBB(id, newQuantity){
    //save it to DDBB
    const data = {
        url: window.location.href,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer '+localStorageToken.accessToken
        },
        orden:{
            mesaName:container.children[0].getAttribute('mesero-mesa_name'),
            id,
            cantidad: newQuantity,
        }
    }
    $.post('/mesero-agregar_cantidad_de_plato_a_la_orden', data).done(( data ) => {
        console.log(data)
    })
}
//remove <tr> from selected table
$("#comanda-selected").on("click", "tr", function(e) {
    if(e.currentTarget.id=='orden'){
        let containerTableRows = e.currentTarget.parentElement
        e.currentTarget.parentNode.removeChild(e.currentTarget)
        let completeTotal = 0
        //redo total
        for(let i=0;containerTableRows.children.length>i;i++){
            let quantity = containerTableRows.children[i].children[2].textContent
            let precio = containerTableRows.children[i].children[3].textContent
            console.log(quantity)
            console.log(precio)
            quantity = parseInt(quantity)
            precio = parseFloat(precio, 2)
            let currentTotal = quantity*precio
            completeTotal = completeTotal + currentTotal
        }
        document.querySelector('#precio_total').textContent = completeTotal
        dropPlatoFromDDBB(e.currentTarget)
    }
})
let mainTable
let categories
this.addEventListener('click', (e)=>{
    let clickedElement = e.target
    // console.log(clickedElement.id)
    if(clickedElement.getAttribute('categoria')){
        filterCategoriesToOnlyDisplayCategory(clickedElement.getAttribute('categoria'))
    }
    //expand comandas
    if(clickedElement.classList=='expand_arrow'){
        //remove orange class for plato ready
        clickedElement.parentElement.classList.remove('orange')
        if(clickedElement.parentElement.parentElement.querySelector('.check').classList.contains('hidden')){
            clickedElement.parentElement.classList.remove('orange')
            clickedElement.parentElement.classList.add('gray-out')
        }
        

        let content = clickedElement.parentElement.nextElementSibling;
        if (content.style.maxHeight){
            content.style.maxHeight = null;
            clickedElement.src='img/expand_arrow.svg'
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
            setTimeout(() => {
                clickedElement.src='img/contract_arrow.svg'
            }, 100);
        }
        setTimeout(() => {
            if(clickedElement.parentElement.parentElement.id!='comanda-selected'){
                window.scrollTo(0, content.scrollHeight)
            }
        }, 200);
    }
    //check if mesa clicked is not the current selected mesa, if it isn't, put it at the top
    else if(clickedElement.classList=='mesa'&&clickedElement.parentElement.parentElement.parentElement.id=='comanda_container'){
        //check if it's grayed out, if so, don't push it to the top
        if(clickedElement.parentElement.classList.contains('gray-out')) return
        //check if there are no mesas currently selected
        if(container.children.length==0){
            let mesaContainer = clickedElement.parentElement.parentElement
            container.append(mesaContainer)
        }else{
            let mesaContainer = container.children[0]
            comandas_container.append(mesaContainer)
            let clickedMesa = clickedElement.parentElement.parentElement
            container.append(clickedMesa)
        }
        
    }//check if mesa clicked is the selected mesa, if it is, move it to the bottom
    else if(clickedElement.classList=='mesa'&&clickedElement.parentElement.parentElement.parentElement.id=='comanda-selected'){
        let mesaContainer = clickedElement.parentElement.parentElement
        document.querySelector('#comanda_container').append(mesaContainer)
    }else if(clickedElement.classList == 'nueva_comanda'){
        modal.style.display = "block";
    }else if(clickedElement.classList=='trashcan'){
        mesaID = clickedElement.closest('.mesa_container').id
        deleteModal.style.display = "block";
    }
    else if(clickedElement.classList=='check'){
        if(clickedElement.closest('.comanda-info').children[0].children[1].children.length==0){
            showError('Su mesa no tiene órdenes')
            return
        }
        savedClickedElement=clickedElement
        sendModal.style.display = "block";
    }else if(clickedElement.id=='cancel-mesa_send'){
        mesaID = clickedElement.parentElement.parentElement.id
        sendModal.style.display = "none";
    }else if(clickedElement.id=='confirm-mesa_send'){
        emitAndSaveToDDBBSelectedTable(savedClickedElement)
        sendModal.style.display = "none";
    }
})

function emitAndSaveToDDBBSelectedTable(clickedElement){
    let tableBody = clickedElement.parentElement.parentElement.parentElement.querySelector('#main_tbody')
        if(tableBody.children.length == 0){
            showError('Su mesa no tiene órdenes')
            return
        }
        let data = []
        let newArray = Array.from(tableBody.children)
        let newObject
        mesaID = clickedElement.parentElement.parentElement.parentElement.parentElement.id
        let mesaNumber = clickedElement.parentElement.parentElement.parentElement.parentElement.children[0].children[0].textContent
        mesaNumber = mesaNumber.toLowerCase()
        mesaNumberSpan.textContent = mesaNumber

        let total = clickedElement.parentElement.previousElementSibling.children[1].textContent
        //create object to send to caja
        // mesaNumber = {mesaNumber: mesaID}d
        let firsRow = {nombre_producto:'total', mesa:mesaID, mesero: miNombre, total}
        data.push(firsRow)
        newArray.forEach(tableRow =>{
            //multiply cantidad por precio para obtener total de ese plato y enviarlo
            let element1 = tableRow.children[2].textContent
            element1 = parseFloat(element1, 2)
            let element2 = tableRow.children[3].textContent
            element2 = parseFloat(element2, 2)
            let currentTotal = element1*element2
            newObject = {
                nombre_producto : tableRow.children[1].textContent,
                precio: tableRow.children[3].textContent, 
                cantidad: tableRow.children[2].textContent, 
                total: currentTotal, 
            }
            data.push(newObject)
        })
        console.log(data)
        orden_para_caja = data
        data = {data}
        
        // socket.emit('Nueva orden', data)
        $.post('/post_orden', data).done(( data ) => {
            console.log(data)
            if(data) {
                socket.emit('Nueva orden', data)
                clickedElement.closest('.mesa_container').children[0].classList.add('gray-out')
                let mesa_container = clickedElement.closest('.mesa_container')
                mesa_container.querySelector('.comanda-info').style.maxHeight = ''
                mesa_container.children[0].children[1].src = 'img/expand_arrow.svg'
                clickedElement.classList.add('hidden')
                
                comandas_container.append(mesa_container)
            }else{
                showError("No se pudo conectar a la base de datos :'(")
             }
        })
        
}
const data = {
    url: window.location.href,
    type: 'POST',
    contentType: 'application/json',
    headers: {
        'Authorization': 'Bearer '+localStorageToken.accessToken
    },
}
$.post('/mesero-load_categories').done(( data ) => {
    let cat_div = document.querySelector('.horizontal-div')
    for(let i=0;data.length>i;i++){
        let category = document.createElement('div')
        category.setAttribute('categoria', data[i].ID)
        category.classList = 'category'
        category.textContent = data[i].nombre_de_categoria
        cat_div.append(category)
    }
})
$.post('/inicio-mesero', data).done(( data ) => {
        console.log(data)
    let tHeadRow = $('#main_thead-tr')
    miNombre = data.nombres
    for(let i=0;data.headers.length>i;i++){
        let th = document.createElement('th')
        th.textContent = data.headers[i]
        if(data.headers[i]=='id'||data.headers[i]=='stock'||data.headers[i]=='Categoría'||data.headers[i]=='cantidad'){th.classList.add('hidden')}
        if(data.headers[i]=='Precio'){th.classList.add('text-align-center')}
        tHeadRow.append(th)
    }
    $('#main_tbody').append(data.html)
    let trs = document.querySelectorAll('#orden')
    trs.forEach(tr =>{
        if(tr.children[5].textContent==0){
            tr.style.backgroundColor = '#f12929'
            tr.style.color = 'white'
        }
    })
    mainTable = document.querySelector('table#main_table')
    categories = mainTable.querySelectorAll('td.cat-selector')
    filterCategoriesToOnlyDisplayCategory(1)
        

})

function filterCategoriesToOnlyDisplayCategory(id){
        categories.forEach(categoria =>{
            if(categoria.textContent!=id){
                categoria.parentElement.style.display='none'
            }else{
                categoria.parentElement.style.display=null
            }
        })
}

// Get the modal
let modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}



//Crear mesas
document.querySelector('#accept_mesa').addEventListener('click', (e)=>{
    let input = e.target.previousElementSibling
    //store it in the DDBB
    let data = {
        url: window.location.href,
        mesaID: input.value,
        type: 'POST',
        headers: {
            'Authorization': 'Bearer '+localStorageToken.accessToken
        },
    }
    let meseroMesaName
    $.post('/mesero-guardar_orden', data).done(( data ) => {
        meseroMesaName = data
        console.log(data)
        let mesas = document.querySelectorAll('.mesa_container')
        let stopper = false
        if(!input.value){
            document.querySelector('.error-mesa').textContent='Llenar número de mesa'
            return
        }
        let mesaNumber = parseInt(input.value)
        for(let i=0;mesas.length>i;i++){
            if(mesas[i].id==mesaNumber){
                document.querySelector('.error-mesa').textContent='Esa mesa ya existe'
                stopper = true
                i=mesas.length
            }
        }
        if(!stopper){

            let div = document.createElement('div')
            div.id = input.value
            div.classList.add('mesa_container')
            div.setAttribute('mesero-mesa_name', meseroMesaName)
            // switch (mesaNumber) {
            //     case 1:
            //         mesaNumber = '01';
            //         break;
            //     case 2:
            //         mesaNumber = '02';
            //         break;
            //     case 3:
            //         mesaNumber = '03';
            //         break;
            //     case 4:
            //         mesaNumber = '04';
            //         break;
            //     case 5:
            //         mesaNumber = '05';
            //         break;
            //     case 6:
            //         mesaNumber = '06';
            //         break;
            //     case 7:
            //         mesaNumber = '07';
            //         break;
            //     case 8:
            //         mesaNumber = '08';
            //         break;
            //     case 9:
            //         mesaNumber = '09';
            //         break;
            //     // default:
            //     //     mesaNumber = input.value
            // }
            div.innerHTML = `
            <div class="comanda-title">
                <span id="${mesaNumber}" class="mesa">Mesa ${mesaNumber}</span>
                <img src="img/expand_arrow.svg" class="expand_arrow">
            </div>
            <div class="comanda-info">
                <table class="comanda_table">
                    <thead class="color-thead">
                        <tr class="comanda-row">
                            <th class="hidden">id</th>
                            <th>Producto</th>
                            <th>cantidad</th>
                            <th class="text-align-center">Precio</th>
                            <th class="hidden">Categoría</th>
                            <th class="hidden">stock</th>
                        </tr>
                    </thead>
                    <tbody id="main_tbody"> 
                    </tbody>
                </table>
                <div class="space-between">
                    <div class="total-container">
                        <h1 style="display:inline-block">Total:&nbsp;&nbsp; </h1><span id="precio_total"></span>
                    </div>
                    <div>
                        <img src="img/check.svg" class="check" alt="">
                        <img src="img/delete.svg" class="trashcan" alt="">
                    </div>
                </div>
            </div>
            `
            comandas_container.append(div)
            modal.style.display = "none";
            input.value = ''
        }
    })
})

// Get the modal
let deleteModal = document.getElementById("delete-confirmation_modal");
let sendModal = document.getElementById("send-confirmation_modal");
let cancelMesaDeleteBtn = document.getElementById("cancel-mesa_delete");
let confirmMesaDeleteBtn = document.getElementById("confirm-mesa_delete");


cancelMesaDeleteBtn.addEventListener('click', ()=>{
    deleteModal.style.display = "none";
})
confirmMesaDeleteBtn.addEventListener('click', ()=>{
    let mesas = document.querySelectorAll('.mesa_container')
    mesas.forEach(mesa =>{
        if(mesa.id==mesaID){
            mesa.remove()
            deleteModal.style.display = "none";

            //remove it from DDBB as well
            let mesaData = {
                url: window.location.href,
                type: 'POST',
                contentType: 'application/json',
                headers: {
                    'Authorization': 'Bearer '+localStorageToken.accessToken
                },
                mesaID
            }
            $.post('/mesero-drop_table', mesaData).done(( data ) => {
                console.log(data)
            })
            return
        }
    })
})
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }else if (event.target == deleteModal) {
      deleteModal.style.display = "none";
    }
}
