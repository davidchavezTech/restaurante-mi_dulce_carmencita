socket.on('Nueva orden', function(data) {
    console.log(data)
    no_hay_ordenes_msg.classList.add('hidden')
    let div = document.createElement('div')
    let trs = ''
    // div.id = data[i][0].id
    div.classList = 'card ordenes-card ordenes-card-cocina'
    div.id = data[0].mesa
    div.setAttribute('table-name', data[0].nombre_producto)
    for(let j=1;data.length>j;j++){
        if(data[j].cocina==cocina){
            let tr = document.createElement('tr')
            tr = `
                <tr>
                    <td>${data[j].nombre_producto}</td>
                    <td>${data[j].cantidad}</td>
                    <td>
                        <input id="terminado_checkbox" class="form-check-input" type="checkbox">
                    </td>
                </tr>
            `
            trs += tr
        }
    }
    if(trs!=''){
        div.innerHTML = `
            <div class="card-body no-events">
                <h2 id="1" class="mesa_identifier">Mesa ${data[0].mesa}</h2>
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>cant.</th>
                            <th>Terminado</th>
                        </tr>
                    </thead>
                    <tbody id="cuerpo_de_table">
                        
                        ${trs}

                    </tbody>
                </table>
            </div>
                
        `
        // <button type="button" class="btn btn-success" id="orden_lista" style="">¡Listo!</button>
        //         <div style="transform:translateY(-15px);text-align:center;" class="hidden">
        //             <p style="color:red;">¿Seguro que ya está listo?</p>
        //             <button type="button" class="btn btn-outline-success" id="orden_lista-confirm_button" style="">¡Listo!</button>
        //             <button type="button" class="btn btn-outline-secondary" id="orden_lista-cancel_button" style="">...Espera</button>
        //         </div>
        active_ordersContainer.append(div)
    }
})

socket.on('add dish to order', (data) =>{
    console.log(data)
    let tr = document.createElement('tr')
    tr.innerHTML = data.tr
    if(tr.lastElementChild.textContent!=cocina) return
    tr.lastElementChild.classList = ''
    tr.lastElementChild.innerHTML = `
        <input id="terminado_checkbox" class="form-check-input" type="checkbox" value="">
    `
    let card = document.getElementById(data.mesaID)
    card.querySelector('#cuerpo_de_table').append(tr)
})

function emmitOrdenCompleta(data){ socket.emit('Nueva orden lista - cocina', data)}
function emmitPlatoCompleto(tableID_and_dish_name){ socket.emit('Nuevo plato listo - cocina', tableID_and_dish_name)}
function emmitStockState(platoID_and_stock_state){ socket.emit('cambio de stock - cocina', platoID_and_stock_state)}
socket.on('Plato updated', (data) =>{
    console.log(data)
    if(data.cocina!=cocina) return
    let card_tbody = document.getElementById(data.mesaID).querySelector('#cuerpo_de_table')
    let trs = card_tbody.querySelectorAll('tr')
    let found=0
    for(let i=0;trs.length>i;i++){
        if(trs[i].children[0].textContent==data.producto){
            found=1
            //we found the dish, now let's see if quantity is different or the same, if the same, it means this dish is not being updated, then ignore
            if(trs[i].children[1].textContent != data.cantidad){
                //we ARE updating an existing dish cus quantity differs
                trs[i].style.backgroundColor = '#e4d73a'
                trs[i].children[1].textContent = data.cantidad
                trs[i].children[2].children[0].checked = false
                trs[i].children[2].children[0].disabled = false
            }
            i = trs.length
        }
    }
    if(found==0){
        let tr = document.createElement('tr')
        tr.style.backgroundColor = '#e4d73a'
        tr.innerHTML = `
            <td>${data.producto}</td>
            <td>${data.cantidad}</td>
            <td style="">
                <input id="terminado_checkbox" class="form-check-input" type="checkbox" value="">
            </td>
        `
        card_tbody.append(tr)
    }
})