let container = document.getElementById('comanda-selected')
let comandas_container = document.querySelector('#comanda_container')
let mesaID
let mesaNumberSpan = document.querySelector('#mesa_number')
let miNombre
let savedClickedElement
$("#main_table").on("click", "tr", function(e) {
    let orig = $(e.currentTarget)[0]
    if(orig.id == 'main_thead-tr') {return}
    let clickedRowID = orig.children[0].textContent
    let copy = orig.cloneNode(true);
    //make quantity visible
    copy.children[2].classList.remove('hidden')
    //check if we selected a mesa
    if(container.children.length!=0){
        let containerTableRows = container.children[0].children[1].children[0].children[1]
        //check if selected mesa is empty
        if(containerTableRows.children.length!=0){
            let gotAmatch = false
            for(let i=0;containerTableRows.children.length>i;i++){//if it has rows in it, cont
                let idForRowBeenSearched = containerTableRows.children[i].children[0].textContent
                //check id of row's first child, aka id <td>
                if(clickedRowID==idForRowBeenSearched){
                    let currentQuantity = containerTableRows.children[i].children[2].textContent
                    currenQuantity = parseFloat(currentQuantity, 2)
                    let newQuantity = currenQuantity + 1
                    containerTableRows.children[i].children[2].textContent = newQuantity
                    gotAmatch = true
                    i=containerTableRows.children.length
                }
            }if(!gotAmatch){
                console.log('not matched')
                //append the copied <tr>
                container.children[0].children[1].children[0].children[1].append(copy)
                i=containerTableRows.children.length
            }
        }else{
            //no platos selected, just append the copied <tr> and don't search if already in there
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
//remove <tr> from selected table
$("#comanda-selected").on("click", "tr", function(e) {
    if(e.currentTarget.id=='orden'){
        let containerTableRows = e.currentTarget.parentElement
        e.currentTarget.parentNode.removeChild(e.currentTarget)
        console.log(containerTableRows)
        let completeTotal = 0
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
    }
})
let mainTable
let categories
this.addEventListener('click', (e)=>{
    let clickedElement = e.target
    // console.log(clickedElement.id)
    
    if(clickedElement.id=='cat-1'){
        filterCategoriesToOnlyDisplayCategory(1)
    }else if(clickedElement.id=='cat-2'){
        filterCategoriesToOnlyDisplayCategory(2)
    }else if(clickedElement.id=='cat-3'){
        filterCategoriesToOnlyDisplayCategory(3)
    }else if(clickedElement.id=='cat-4'){
        filterCategoriesToOnlyDisplayCategory(4)
    }
    //expand comandas
    if(clickedElement.classList=='expand_arrow'){
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
    else if(clickedElement.id=='mesa'&&clickedElement.parentElement.parentElement.parentElement.id=='comanda_container'){
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
    else if(clickedElement.id=='mesa'&&clickedElement.parentElement.parentElement.parentElement.id=='comanda-selected'){
        let mesaContainer = clickedElement.parentElement.parentElement
        document.querySelector('#comanda_container').append(mesaContainer)
    }else if(clickedElement.classList == 'nueva_comanda'){
        modal.style.display = "block";
    }else if(clickedElement.classList=='trashcan'){
        mesaID = clickedElement.closest('.mesa_container').id
        deleteModal.style.display = "block";
    }
    else if(clickedElement.classList=='check'){
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
                clickedElement.remove()
                
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

$.post('/inicio-mesero', data).done(( data ) => {
        console.log(data)
    let theadRow = $('#main_thead-tr')
    miNombre = data.nombres
    for(let i=0;data.headers.length>i;i++){
        let th = document.createElement('th')
        th.textContent = data.headers[i]
        if(data.headers[i]=='id'||data.headers[i]=='stock'||data.headers[i]=='Categoría'||data.headers[i]=='cantidad'){th.classList.add('hidden')}
        if(data.headers[i]=='Precio'){th.classList.add('text-align-center')}
        theadRow.append(th)
    }
    $('#main_tbody').append(data.html)
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
        switch (mesaNumber) {
            case 1:
                mesaNumber = '01';
                break;
            case 2:
                mesaNumber = '02';
                break;
            case 3:
                mesaNumber = '03';
                break;
            case 4:
                mesaNumber = '04';
                break;
            case 5:
                mesaNumber = '05';
                break;
            case 6:
                mesaNumber = '06';
                break;
            case 7:
                mesaNumber = '07';
                break;
            case 8:
                mesaNumber = '08';
                break;
            case 9:
                mesaNumber = '09';
                break;
            // default:
            //     mesaNumber = input.value
        }
        div.innerHTML = `
        <div class="comanda-title">
            <span id="mesa">Mesa #${mesaNumber}</span>
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
