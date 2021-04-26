function loadUsuarios(){
    let data = {
        url: window.location.href,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer '+localStorageToken.accessToken
        },
    }
    $.post('/admin-get_users', data).done(( data ) => {
        console.log(data)
        let trs=''
        for(let i=0;data.length>i;i++){
            let adminSelected = ''
            let meseroSelected = ''
            let cajeroSelected = ''
            let cocinaSelected = ''
            if(data[i].set_permission=='admin') adminSelected='selected'
            else if(data[i].set_permission=='mesero') meseroSelected='selected'
            else if(data[i].set_permission=='caja') cajeroSelected='selected'
            else if(data[i].set_permission=='cocina') cocinaSelected='selected'
            trs+=`<tr id='${data[i].id}'>
                    <td>${data[i].names}</td>
                    <td>${data[i].email}</td>
                    <td>
                        <select class="form-select" value="" id="flexCheckDefault">
                            <option value="admin" ${adminSelected}>Aministrador</option>
                            <option value="mesero" ${meseroSelected}>Mesero</option>
                            <option value="caja" ${cajeroSelected}>Caja</option>
                            <option value="cocina" ${cocinaSelected}>Cocina</option>
                        </select>
                    </td>
                    <td class='center-td'><button id='eliminarUsuario' type="button" class="btn btn-danger">X</button></td>
                    <td><button id='editarUsuario' type="button" class="btn btn-success">Editar</button></td>
                </tr>`
        }
        mainContainer.innerHTML = `
            <div class="card col-10 ordenes-card">
                <div class="card-body">
                    <h2 id="35" class="mesa_identifier">Usuarios</h2>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Nombre Completo</th>
                                <th>Correo electrónico</th>
                                <th>Permiso</th>
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
                                <button type="button" class="btn btn-link" style='font-size:20px' id="crearUsuario">Crear nuevo usuario</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    })
}

