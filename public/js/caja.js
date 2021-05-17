// let ordenesContainer = document.querySelector('#ordenes')
let cancelar_un_plato_o_todos
let numero_de_mesa_input = document.querySelector('#checkout_card-numero_de_mesa')
let modal_aperturarCaja = document.querySelector('#modal-aperturar_caja')
let totalCheckout = document.querySelector('#checkout_card-precio_total')
let pagar_inputs = document.querySelector('#pagar_inputs')
let faltaContainer = document.querySelector('#falta_o_sobra')
let toast = document.querySelector('.toast')
let no_se_pudo_encontrar_esa_mesa_P = document.querySelector('#no_se_pudo_encontrar_esa_mesa')
let plato_para_cancelar
let DDBBTableName
let option = {
    delay: 2000
}
let globalClickedElement
let send_paid_orderBtn = document.querySelector('#send_paid_order-btn')
let toasterElement = document.querySelector('.toast-body')
// var toastElList = [].slice.call(document.querySelectorAll('.toast'))
// var toastList = toastElList.map(function (toastEl) {
//   return new bootstrap.Toast(toastEl, option)
// })

let efectivoInput = document.querySelector('#efectivo')
let tarjetaInput = document.querySelector('#tarjeta')
let yapeInput = document.querySelector('#yape')
send_paid_orderBtn.addEventListener('click',()=>{
    
    if(faltaContainer.textContent!='Vuelto: '){
        toasterElement.textContent = 'Monto insuficiente'
        return toastMesaEmpty.show()
    }
    let findMesa = document.getElementById(numero_de_mesa_input.value)
    let mesaName = findMesa.closest('.ordenes-card').getAttribute('mesa_name')
    let mesero = findMesa.closest('.ordenes-card').getAttribute('mesero')
    let data = {
        mesaID: numero_de_mesa_input.value,
        mesaName: mesaName,
        meseroName: mesero,
        efectivo: efectivoInput.value,
        tarjeta: tarjetaInput.value,
        yape: yapeInput.value,
        url: window.location.href,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer '+localStorageToken.accessToken
        },
    }
    $.post('/caja-pay_pedido', data).done(( data ) => {
        console.log(data)
        if(data==true){
            let efectivoPayment = efectivoInput.value
            if(efectivoPayment != ''){
                efectivoPayment = parseFloat(efectivoPayment, 1)
            }else{
                efectivoPayment = 0
            }
            let tarjetaPayment = tarjetaInput.value
            if(tarjetaPayment != ''){
                tarjetaPayment = parseFloat(tarjetaPayment, 1)
            }else{
                tarjetaPayment = 0
            }
            let yapePayment = yapeInput.value
            if(yapePayment != ''){
                yapePayment = parseFloat(yapePayment, 1)
            }else{
                yapePayment = 0
            }
            // let ammountPaid = efectivoPayment + tarjetaPayment + yapePayment
            let currentTotal = totalCheckout.textContent
            currentTotal = parseFloat(currentTotal, 1)
            let ingresoFisico = efectivoPayment - currentTotal
            // let newCajaMoney = ammountPaid - currentTotal
            // cajaMoney = cajaMoney + newCajaMoney
            // localStorage.setItem('cajaMoney', cajaMoney)
            findMesa.closest('.ordenes-card').remove()
            deselectCards()
            numero_de_mesa_input.value = ''
            efectivoInput.value = ''
            tarjetaInput.value = ''
            yapeInput.value = ''
            totalCheckout.textContent = '0'
            //second request to insert the payment into ddbb
            let newData = {
                ingresos: ingresoFisico,
                tarjeta: tarjetaPayment,
                yape: yapePayment,
                url: window.location.href,
                type: 'POST',
                contentType: 'application/json',
                headers: {
                    'Authorization': 'Bearer '+localStorageToken.accessToken
                },
            }
            $.post('/set_nuevo_ingreso_a_caja', newData).done(( data ) => {
                console.log(data)
            })
        }
    })
    
})
let toastMesaEmpty = new bootstrap.Toast(toast, option)

socket.on('Nueva orden', function(nuevaOrden) {
    console.log(nuevaOrden)
    let div = document.createElement('div')
    div.classList = 'card col-5 ordenes-card'
    div.setAttribute('mesa_name', nuevaOrden[0].nombre_producto)
    div.setAttribute('mesero', nuevaOrden[0].mesero)
    let html = ''
    for(i=1;nuevaOrden.length>i;i++){
        let newHTML= `
            <tr>
                <td>${nuevaOrden[i].nombre_producto}</td>
                <td>${nuevaOrden[i].cantidad}</td>
                <td>${tF(nuevaOrden[i].precio)}</td>
                <td>
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                </td>
                <td>${tF(nuevaOrden[i].total)}</td>
            </tr>
        `
        html = html + newHTML
    }
    div.innerHTML = `
        
        <div class="card-body no-events">
            <h2 id="${nuevaOrden[0].mesa}" class="mesa_identifier">Mesa ${nuevaOrden[0].mesa}</h2>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>cant.</th>
                        <th>P.Unitario</th>
                        <th>Cancelado</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody id="cuerpo_de_table">
                    ${html}
                </tbody>
            </table>
            <h2 style="display:inline-block">Total:&nbsp</h2><h2 id="precio_total_de_orden" style="display:inline-block">${nuevaOrden[0].total}</h2>
            <div style="position: absolute;top:25px;right:15px;">
                <div class="mb-12 row">
                    <div class="col-sm-12">
                        <h4 style="display:inline-block;">Cancelar todo:&nbsp&nbsp</h4><input id="cancelar_whole_orden" type="checkbox" style="display:inline-block;pointer-events:auto">
                    </div>
                </div>
            </div>
        </div>
        
    `
    ordenes_container.append(div)
});
socket.on('Plato updated', (data) =>{
    console.log(data)
    let tr = document.createElement('tr')
    tr.innerHTML = `
        <td>${data.producto}</td>
        <td>${data.cantidad}</td>
        <td>${tF(data.precio)}</td>
        <td>
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
        </td>
        <td>${tF(data.total)}</td>
    `
    let card = document.getElementById(data.mesaID).parentElement
    let tBody = card.querySelector('#cuerpo_de_table')
    let found
    for(let i = 0;tBody.children.length>i;i++){
        let nombreDePlato = tBody.children[i].children[0].textContent
        let qty = tBody.children[i].children[1].textContent
        if(nombreDePlato==data.producto){
            found=1
            if(qty!=data.cantidad){
                tBody.children[i].style.backgroundColor = '#f3d43b'
                tBody.children[i].children[1].textContent = data.cantidad
                tBody.children[i].children[4].textContent = data.total
            }
            i=tBody.children.length
        }
    }
    if(!found){
        tr.style.backgroundColor = '#f3d43b'
        tBody.append(tr)
    }
    let totales = 0
    for(let i=0;tBody.children.length>i;i++){
        totales += parseFloat(tBody.children[i].children[4].textContent)
    }
    totalContainer = card.querySelector('#precio_total_de_orden')
    totalContainer.textContent = tF(totales)
})
window.addEventListener('click', (e)=>{
    let clickedElement = e.target
    if(clickedElement.classList.contains('ordenes-card')){
        deselectCards()
        clickedElement.scrollIntoView({behavior: "smooth"});
        //create an offset for scrollIntoView
        // var headerOffset = 45;
        // var elementPosition = clickedElement.getBoundingClientRect().top;
        // var offsetPosition = elementPosition - headerOffset;

        // window.scrollTo({
        //     top: offsetPosition,
        //     behavior: "smooth"
        // });
        clickedElement.classList.add('card-selected')
        let currentMesaID = clickedElement.querySelector('.mesa_identifier').id
        let currentPrecioTotal = clickedElement.querySelector('#precio_total_de_orden').textContent
        numero_de_mesa_input.value = currentMesaID
        totalCheckout.textContent = currentPrecioTotal
        console.log(clickedElement)
        getHowMuchIsOwed(clickedElement)
    }else if(clickedElement.classList.contains('form-check-input')){
        e.preventDefault()
        cancelar_un_plato_o_todos = 1
        DDBBTableName = clickedElement.closest('.ordenes-card').getAttribute('mesa_name')
        plato_para_cancelarName = clickedElement.closest('tr').children[0].textContent
        cancelarOrdenConfirmCantidadSpan.textContent = clickedElement.parentElement.previousElementSibling.previousElementSibling.textContent
        cancelarOrdenConfirmNombreSpan.textContent = clickedElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent
        cancelarOredenMesaNumber.textContent = clickedElement.closest('.card-body').children[0].id
        modal_adminPermission_for_canceling_plato.style.display = 'block'
        globalClickedElement = clickedElement
        // deselectCards()
        // let cardParent = clickedElement.closest(".ordenes-card")
        // cardParent.classList.add('card-selected')
        // let currentMesaID = cardParent.querySelector('.mesa_identifier').id
        // let currentPrecioTotal = cardParent.querySelector('#precio_total_de_orden').textContent
        // numero_de_mesa_input.value = currentMesaID
        // totalCheckout.textContent = currentPrecioTotal
        // getHowMuchIsOwed(cardParent)
    }else if(clickedElement.id=='cancelar_whole_orden'){
        e.preventDefault()
        cancelar_un_plato_o_todos = 'todos'
        DDBBTableName = clickedElement.closest('.ordenes-card').getAttribute('mesa_name')
        cancelarOrdenConfirmCantidadSpan.textContent = 'TODOS LOS PLATOS'
        cancelarOrdenConfirmNombreSpan.textContent = ''
        cancelarOredenMesaNumber.textContent = clickedElement.closest('.card-body').children[0].id
        modal_adminPermission_for_canceling_plato.style.display = 'block'
        globalClickedElement = clickedElement
    }
})
//start proccess for admin permission
let modal_adminPermission_for_canceling_plato = document.querySelector('#admin_permission-cancelar_plato')
let cancelarOrdenConfirmCantidadSpan = document.querySelector('#cancelar_confirm-cantidad')
let cancelarOrdenConfirmNombreSpan = document.querySelector('#cancelar_confirm-nombre')
let cancelarOredenMesaNumber = document.querySelector('#cancelar_confirm-orden_mesa')
let cancel_cancelarPlatoBtn = document.getElementById("cancel-cancelar_plato");
let cancelar_plato_confirmBtn = document.querySelector('#confirm-cancelar_plato')
let cancelar_plato_emailInput = document.querySelector('#cancelar-admin_email')
let cancelar_plato_passwordInput = document.querySelector('#cancelar-admin_password')
let admin_confirm_error = document.querySelector('#admin_confirm_error')
cancel_cancelarPlatoBtn.addEventListener('click', ()=>{
    modal_adminPermission_for_canceling_plato.style.display = 'none'
    clearAdminInputFields()
})

cancelar_plato_confirmBtn.addEventListener('click',()=>{
    //run the following if only one plato is being cancelled
    if(cancelar_un_plato_o_todos==1){
        let is_checkbox_checked = globalClickedElement.checked
        let mesero = globalClickedElement.closest('.ordenes-card').getAttribute('mesero')
        let mesaID = globalClickedElement.closest('.card-body').children[0].id
        let email = cancelar_plato_emailInput.value
        let password = cancelar_plato_passwordInput.value
        let data = {
            email,
            password,
            plato: plato_para_cancelarName,
            mesaName: DDBBTableName,
            isItChecked: is_checkbox_checked,
            mesero,
            mesaID
        }
        $.post('/admin-cancelar_plato', data).done(async ( data ) => {
            if(data===false) {
                admin_confirm_error.classList.remove('hidden')
                return
            }
            if(data==1) {
                globalClickedElement.checked=false
                globalClickedElement.parentElement.parentElement.children[1].textContent = 0
                let data = {
                    plato: plato_para_cancelarName,
                    ordesrTableName: DDBBTableName,
                    mesero: mesero,
                    mesaID
                }
                await $.post('/reset-plato-to-zero', data)
                globalClickedElement.closest('tr').style.backgroundColor = ''
            }else if(data==0){
                globalClickedElement.checked=true
            }
            // globalClickedElement.checked = data.checked
            deselectCards()
            let cardParent = globalClickedElement.closest(".ordenes-card")
            cardParent.classList.add('card-selected')
            let currentMesaID = cardParent.querySelector('.mesa_identifier').id
            let currentPrecioTotal = cardParent.querySelector('#precio_total_de_orden').textContent
            numero_de_mesa_input.value = currentMesaID
            totalCheckout.textContent = currentPrecioTotal
            getHowMuchIsOwed(cardParent)

            modal_adminPermission_for_canceling_plato.style.display = 'none'
            clearAdminInputFields()
            platoName_mesaID = {
                platoName: plato_para_cancelarName,
                mesaID: currentMesaID
            }
            socket.emit('Orden cancelada', platoName_mesaID)
        })
    }else if(cancelar_un_plato_o_todos=='todos'){
        let is_checkbox_checked = globalClickedElement.checked
        let email = cancelar_plato_emailInput.value
        let password = cancelar_plato_passwordInput.value
        let data = {
            email,
            password,
            mesaName: DDBBTableName,
            isItChecked: is_checkbox_checked
        }
        $.post('/admin-cancelar_whole_order', data).done(( data ) => {
            console.log(data)
            if(data===false) {
                admin_confirm_error.classList.remove('hidden')
                return
            }
            checkAllChecks(globalClickedElement.closest('.ordenes-card'), data)
            deselectCards()
            let cardParent = globalClickedElement.closest(".ordenes-card")
            cardParent.classList.add('card-selected')
            let currentMesaID = cardParent.querySelector('.mesa_identifier').id
            let currentPrecioTotal = cardParent.querySelector('#precio_total_de_orden').textContent
            numero_de_mesa_input.value = currentMesaID
            totalCheckout.textContent = currentPrecioTotal
            getHowMuchIsOwed(cardParent)

            modal_adminPermission_for_canceling_plato.style.display = 'none'
            clearAdminInputFields()
        })
    }
})
function checkAllChecks(card, data){
    let checks = card.querySelectorAll('.form-check-input')
    let isItChecked
    (data==0)?isItChecked=true : isItChecked=false
    checks.forEach(check =>{
        check.checked = isItChecked
    })
}
function clearAdminInputFields(){
    cancelar_plato_emailInput.value = ''
    cancelar_plato_passwordInput.value = ''
    admin_confirm_error.classList.add = 'hidden'
}

pagarInputs = pagar_inputs.querySelectorAll('input')


pagarInputs.forEach(input=>{
    input.addEventListener('keyup', ()=>{
        if (!numero_de_mesa_input.value){
            input.value = ''
            toasterElement.textContent = 'Escoger número de mesa'
            return toastMesaEmpty.show()
        }
        getHowMuchIsOwed()
    })
})
numero_de_mesa_input.addEventListener('keyup', (e)=> {
    deselectCards()
    if(numero_de_mesa_input.value == ''){
        
        no_se_pudo_encontrar_esa_mesa_P.style.display = 'none'
        totalCheckout.textContent = 0
        return
    }
    let mesa = document.getElementById(e.target.value)
    if(!mesa){
        no_se_pudo_encontrar_esa_mesa_P.style.display = 'block'
        return
    }
    mesa.parentElement.parentElement.classList.add('card-selected')
    mesa.scrollIntoView({behavior: "smooth"});
    //create an offset for scrollIntoView
    
    // var headerOffset = 45;
    // var elementPosition = mesa.getBoundingClientRect().top;
    // var offsetPosition = elementPosition - headerOffset;

    // window.scrollTo({
    //      top: offsetPosition,
    //      behavior: "smooth"
    // });
    getHowMuchIsOwed()
})
function getHowMuchIsOwed(clickedElement){
    let monto = 0
    let mesaID = numero_de_mesa_input.value
    let currentMesa
    let pagado = 0
    if(clickedElement){
        currentMesa = clickedElement
        
    }else{
        document.getElementById(mesaID).parentElement
        currentMesa = document.getElementById(mesaID).parentElement
    }
    let canceladosInputs = currentMesa.querySelectorAll('input.form-check-input')
    canceladosInputs.forEach((cancelado)=>{
        if(!cancelado.checked){
            let currentMonto = cancelado.parentElement.nextElementSibling.textContent
            currentMonto = parseFloat(currentMonto)
            monto = monto + currentMonto
        }
    })
    if(!document.getElementById(mesaID)){
        no_se_pudo_encontrar_esa_mesa_P.style.display = 'block'
        totalCheckout.textContent = 0
        return
    }else{
        no_se_pudo_encontrar_esa_mesa_P.style.display = 'none'
    }
    
    pagarInputs.forEach(input=>{
        let plata = input.value
        plata == '' ? plata = 0 :
        plata = parseFloat(plata)
        pagado = pagado + plata
    })
    if(monto>pagado){
        faltaContainer.textContent = 'Faltan: '
    }else{
        faltaContainer.textContent = 'Vuelto: '
    }
    currentMesa.querySelector('#precio_total_de_orden').textContent = tF(monto)
    monto = parseFloat(monto)
    let montoParaRecortar = (monto-pagado)

    totalCheckout.textContent = tF(montoParaRecortar)
    let currentTotal = currentMesa.querySelector('#precio_total_de_orden').textContent
    currentTotal = parseFloat(currentTotal)
    //if total = 0, that means all ordenes have been cancelled=> check the checkbox for 'cancelar todo'
    if(currentTotal==0){
        currentMesa.querySelector('#cancelar_whole_orden').checked = true
    }else{
        currentMesa.querySelector('#cancelar_whole_orden').checked = false
    }
}
function deselectCards(){
    let AllCards = document.querySelectorAll('.ordenes-card')
    AllCards.forEach(card=>{
        card.classList.remove('card-selected')
    })
}
let ordenes_container = document.querySelector('#ordenes_container')
function loadMesasDelDia(){
    let data = {
        url: window.location.href,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer '+localStorageToken.accessToken
        },
    }
    $.post('/esta_caja_abierta', data).done(( data ) => {
        console.log(data)
        if(!data) modal_aperturarCaja.style.display = 'block'
    })
    $.post('/get_todays_orders').done(( data ) => {
        console.log(data)
        for(let i=0;data.length>i;i++){
            let nombre_de_current_mesa = data[i][0].nombre_producto
            let mesero = data[i][0].mesero
            mesero = mesero.replace(/\s+/g, '').toLowerCase()

            let trs = ''
            let div = document.createElement('div')
            div.classList = 'card col-5 ordenes-card'
            div.setAttribute('mesa_name', nombre_de_current_mesa) 
            div.setAttribute('mesero', mesero) 
            let mesaID = data[i][0].mesa
            let total_de_current_mesa = data[i][0].total
            // console.log(data[0].length)
            for(let j=1;data[i].length>j;j++){
                let tr
                let nombre = data[i][j].nombre_producto
                let precio = data[i][j].precio
                let cantidad = data[i][j].cantidad
                let cancelada_pagada = data[i][j].cancelada_pagada
                let total = data[i][j].total
                let updated = data[i][j].updated
                let backgroundColor = ''
                if(updated==1){
                    backgroundColor = 'background-color:#f3d43b;'
                }
                if(cancelada_pagada==1){
                    cancelada_pagada=''
                }else{
                    cancelada_pagada='checked'
                }
                
                tr=`
                    <tr style="${backgroundColor}">
                        <td>${nombre}</td>
                        <td>${cantidad}</td>
                        <td>${tF(precio)}</td>
                        <td>
                            <input class="form-check-input" type="checkbox" id="flexCheckDefault" ${cancelada_pagada}>
                        </td>
                        <td>${tF(total)}</td>
                    </tr>
                `
                trs= trs+tr
            }
            div.innerHTML=`
                <div class="card-body no-events">
                    <h2 id="${mesaID}" class="mesa_identifier">Mesa ${mesaID}</h2>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>cant.</th>
                                <th>P.Unitario</th>
                                <th>Cancelado</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody id="cuerpo_de_table">
                            ${trs}
                        </tbody>
                    </table>
                    <h2 style="display:inline-block">Total:&nbsp;</h2><h2 id="precio_total_de_orden" style="display:inline-block">${tF(total_de_current_mesa)}</h2>
                    <div style="position: absolute;top:25px;right:15px;">
                        <div class="mb-12 row">
                            <div class="col-sm-12">
                                <h4 style="display:inline-block;">Cancelar todo:&nbsp&nbsp</h4><input id="cancelar_whole_orden" type="checkbox" style="display:inline-block;pointer-events:auto">
                            </div>
                        </div>
                    </div>
                </div>
            `
            ordenes_container.append(div)
        }
        //redo math for all totals in case there has been an order cancelled
        let allTickets = document.querySelectorAll('.ordenes-card')
        allTickets.forEach(ticket=>{
            numero_de_mesa_input.value = ticket.querySelector('h2').id
            getHowMuchIsOwed(ticket)
        })
        //clear mesa# input and total 
        numero_de_mesa_input.value = ''
        totalCheckout.textContent = '0'
    })
}loadMesasDelDia()



aperturarCajaConfirmBtn = document.querySelector('#confirm-aperturar_caja')
aperturarCajaInput = document.querySelector('#aperturar_caja-input')
aperturarCajaError = document.querySelector('#aperturar_caja-error')

aperturarCajaConfirmBtn.addEventListener('click', ()=>{
    if(!(aperturarCajaInput.value)){
        aperturarCajaError.style.display="block"
        return
    }
    let monto = aperturarCajaInput.value
    monto = parseFloat(monto)
    if(!(monto>=0)){
        aperturarCajaError.style.display="block"
        return
    }
    // (aperturarCajaInput.value) ? localStorage.setItem('cajaMoney', aperturarCajaInput.value) : localStorage.setItem('cajaMoney', 0)
    let data = {
        url: window.location.href,
        montoAperturarCaja: monto,
        type: 'POST',
        headers: {
            'Authorization': 'Bearer '+localStorageToken.accessToken
        },
    }
    $.post('/caja-aperturar_caja', data).done(( data ) => {
        if(data==true){
            modal_aperturarCaja.style.display='none'
        }else{
            document.querySelector('#aperturar_caja-connection_error').style.display='block'
        }
    })
    
})

let modalCerrarCaja = document.getElementById('modal-cerrar_caja')
let montoParaCerrarCajaH4element = document.getElementById('cerrar_caja-monto')
let confirmCerrarCaja = document.getElementById('confirm-cerrar_caja')

modalCerrarCajaBtn = document.getElementById('modal-cerrarCaja_button')

modalCerrarCajaBtn.addEventListener('click', ()=>{
    let data = {
        url: window.location.href,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer '+localStorageToken.accessToken
        }
    }
    $.post('/caja-caja_amount_request', data).done(( data ) => {
        montoParaCerrarCajaH4element.textContent = data
        modalCerrarCaja.style.display='block'
    })
})

//cerramos caja y nos deslogueamos
confirmCerrarCaja.addEventListener('click', ()=>{
    let data = {
        url: window.location.href,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer '+localStorageToken.accessToken
        },
        monto: document.querySelector('#cerrar_caja-input').value
    }
    $.post('/caja-cerrar_caja', data).done(( data ) => {
        localStorage.removeItem('JWT')
        window.location.href = 'http://' + window.location.hostname + ':4000/';
    })
    
})
document.querySelector('#cancel-cerrar_caja').addEventListener('click',()=>{
    modalCerrarCaja.style.display='none'
})

document.querySelector('#cerrar_caja-input').addEventListener('keyup', (e)=>{
    if(e.target.value>0) document.querySelector('#confirm-cerrar_caja').disabled = false
    else document.querySelector('#confirm-cerrar_caja').disabled = true
})
$(document).ready(function (){
    document.querySelector('#logoutCont').style.display = 'none'
})