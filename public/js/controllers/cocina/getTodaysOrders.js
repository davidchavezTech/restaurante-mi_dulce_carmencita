function getTodaysOrders(state){
    no_hay_ordenes_msg.classList.remove('hidden')
    no_hay_ordenes_msg.classList.add('block')
    $.post('/cocina-get_todays_orders', {state}).done(( data ) => {
        console.log(data)
        let hideButton =''
        let disabled = ''
        let hide = ''
        if(state==1){
            no_hay_ordenes_msg.innerHTML='<br><br>No hay órdenes procesadas el día de hoy'
            hideButton='display:none;'
            disabled='disabled'
            hide='display:none;'
        }else{
            no_hay_ordenes_msg.innerHTML='<br><br>No hay ordenes para preparar todavía...'
        }
        //create cards from response
        for(let i=0;data.length>i;i++){
            no_hay_ordenes_msg.classList.add('hidden')
            let div = document.createElement('div')
            let trs = ''
            // div.id = data[i][0].id
            div.classList = 'card ordenes-card ordenes-card-cocina'
            div.id = data[i][0].mesa
            div.setAttribute('table-name', data[i][0].nombre_producto)
            for(let j=1;data[i].length>j;j++){
                if(data[i][j].cocina==cocina){
                    let tr = document.createElement('tr')
                    let preparada = data[i][j].preparada
                    let updated = data[i][j].updated
                    if(preparada==0){
                        preparada=''
                    }else{
                        preparada='checked'
                    }
                    if(updated==0){
                        updated=''
                    }else{
                        updated='background-color:#e4d73a'
                    }
                    tr = `
                        <tr style='${updated}'>
                            <td>${data[i][j].nombre_producto}</td>
                            <td>${data[i][j].cantidad}</td>
                            <td style='${hide}'>
                                <input id="terminado_checkbox" class="form-check-input" type="checkbox" value="" ${preparada} ${disabled}>
                            </td>
                        </tr>
                    `
                    trs += tr
                }
            }
            if(trs!=''){
                div.innerHTML = `
                <div class="card-body no-events">
                    <h2 class="mesa_identifier">Mesa ${data[i][0].mesa}</h2>
                    <p><strong>Atendido por: </strong>${data[i][0].mesero}</p>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>cant.</th>
                                <th style='${hide}'>Terminado</th>
                            </tr>
                        </thead>
                        <tbody id="cuerpo_de_table">
                            
                            ${trs}

                        </tbody>
                    </table>
                </div>
                    
            `
            // <button type="button" class="btn btn-success" id="orden_lista" style="${hideButton}">¡Listo!</button>
            //         <div style="transform:translateY(-15px);text-align:center;" class="hidden">
            //             <p style="color:red;">¿Seguro que ya está listo?</p>
            //             <button type="button" class="btn btn-outline-success" id="orden_lista-confirm_button" style="">¡Listo!</button>
            //             <button type="button" class="btn btn-outline-secondary" id="orden_lista-cancel_button" style="">...Espera</button>
            //         </div>
            active_ordersContainer.append(div)
            }
            
        }
    })
}