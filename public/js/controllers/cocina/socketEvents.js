socket.on('Nueva orden', function(data) {
    console.log(data)
    no_hay_ordenes_msg.classList.add('hidden')
    let div = document.createElement('div')
    let trs = ''
    // div.id = data[i][0].id
    div.classList = 'card ordenes-card ordenes-card-cocina'
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
                <button type="button" class="btn btn-success" id="orden_lista" style="">¡Listo!</button>
                <div style="transform:translateY(-15px);text-align:center;" class="hidden">
                    <p style="color:red;">¿Seguro que ya está listo?</p>
                    <button type="button" class="btn btn-outline-success" id="orden_lista-confirm_button" style="">¡Listo!</button>
                    <button type="button" class="btn btn-outline-secondary" id="orden_lista-cancel_button" style="">...Espera</button>
                </div>
        `
        active_ordersContainer.append(div)
    }
})
function emmitOrdenCompleta(data){ socket.emit('Nueva orden lista - cocina', data)}
function emmitPlatoCompleto(tableID_and_dish_name){ socket.emit('Nuevo plato listo - cocina', tableID_and_dish_name)}
function emmitStockState(platoID_and_stock_state){ socket.emit('cambio de stock - cocina', platoID_and_stock_state)}