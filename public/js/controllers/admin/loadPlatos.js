function loadPlatos(){
    let data = {
        url: window.location.href,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer '+localStorageToken.accessToken
        },
    }
    $.post('/admin-get_platos', data).done(( data ) => {
        console.log(data)
        $.post('/admin-get_categories', data).done(( newData ) => {
            console.log(newData)
            let categoriasOptions = ''
            for(let i=0;newData.length>i;i++){
                categoriasOptions += `<option value="${newData[i].nombre_de_categoria}">${newData[i].nombre_de_categoria}</option>`
            }
            let trs=''
            for(let i=0;data.length>i;i++){
                let firstcategoriaOption = `<option value="${data[i].categoria}">${data[i].categoria}</option>`
                let allCategories = firstcategoriaOption+categoriasOptions
                trs+=`<tr id="${data[i].id}">
                        <td>${data[i].nombre_producto}</td>
                        <td style="text-align:center">${data[i].precio_venta}</td>
                        <td style="text-align:center">${data[i].costo}</td>
                        <td>
                            <select class="form-select" id="platosCategorySelect">
                                ${allCategories}
                            </select>
                        </td>
                        <td  class='center-td'><button type="button" id='delete-plato' class="btn btn-danger">X</button></td>
                        <td><button id='edit-plato' type="button" class="btn btn-success">Editar</button></td>
                    </tr>
            `
            }
            mainContainer.innerHTML = `
                <div class="card col-10 ordenes-card">
                    
                    <div class="card-body">
                        <h2>Productos</h2>
                        <br>
                        <br>
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Precio de venta</th>
                                    <th>Costo unitario promedio</th>
                                    <th>Categoría</th>
                                    <th>Eliminar</th>
                                    <th>Editar</th>
                                </tr>
                            </thead>
                            <tbody id="cuerpo_de_table">
                                ${trs}
                        </tbody>
                        </table>
                        <div style="position: absolute;top:25px;right:15px;">
                            <div class="mb-12 row">
                                <div class="col-sm-12">
                                    <button id='create-plato' type="button" class="btn btn-link" style='font-size:20px'>Crear producto</button>
                                </div>
                            </div>
                        </div>
                        <div style="position: absolute;top:25px;right:200px;">
                            <div class="mb-12 row">
                                <div class="col-sm-12">
                                    <button id='create-categoria' type="button" class="btn btn-link" style='font-size:20px'>Crear categoría</button>
                                </div>
                            </div>
                        </div>
                        <div style="position: absolute;top:25px;right:385px;">
                            <div class="mb-12 row">
                                <div class="col-sm-12">
                                    <button id='delete-categoria' type="button" class="btn btn-link" style='font-size:20px;color:red'>Eliminar categoría</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
            //remove duplicates and keep selected option selected
            document.querySelectorAll('select').forEach(select =>{
                let options = select.querySelectorAll('option')
                let currentOption = options[0]
                for(let i=1;options.length>i;i++){
                    if(currentOption.value==options[i].value){
                        options[i].remove()
                        i=options.length
                    }
                }
            })
        })
        
        
    })
}

