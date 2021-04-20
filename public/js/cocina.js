let active_ordersContainer = document.querySelector('#ordenes_container')
$.post('/cocina-get_todays_orders').done(( data ) => {
    console.log(data)
    //create cards from response
    for(let i=0;data.length>i;i++){
        let div = document.createElement('div')
        let trs = ''
        // div.id = data[i][0].id
        div.classList = 'card ordenes-card ordenes-card-cocina'
        div.setAttribute('table-name', data[i][0].nombre_producto)
        for(let j=1;data[0].length>j;j++){
            let tr = document.createElement('tr')
            let preparada = data[i][j].preparada
            if(preparada==0){
                preparada=''
            }else{
                preparada='checked'
            }
            tr = `
                <tr>
                    <td>${data[i][j].nombre_producto}</td>
                    <td>${data[i][j].cantidad}</td>
                    <td>
                        <input class="form-check-input" type="checkbox" value="" ${preparada}>
                    </td>
                </tr>
            `
            trs += tr
        }
        div.innerHTML = `
            <div class="card-body no-events">
                <h2 id="1" class="mesa_identifier">Mesa ${data[i][0].mesa}</h2>
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
                <div style="transform:translateY(-15px);text-align:center;display:none">
                    <p style="color:red;">¿Seguro que ya está listo?</p>
                    <button type="button" class="btn btn-outline-success" id="orden_lista-confirm_button" style="">¡Listo!</button>
                    <button type="button" class="btn btn-outline-secondary" id="orden_lista-cancel_button" style="">...Espera</button>
                </div>
        `
        active_ordersContainer.append(div)
    }
})