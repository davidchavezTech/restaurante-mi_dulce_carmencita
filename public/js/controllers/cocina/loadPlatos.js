function loadPlatos(){
    no_hay_ordenes_msg.classList.add('hidden')
    active_ordersContainer.innerHTML=`
        <div class="horizontal-div"></div>
        <div class="row justify-content-center">
            <div class="col-12">
                <table id="main_table" class="table table-borderless cell-border hover order-column row-border stripe ">
                    <thead id="main_thead"><tr id="main_thead-tr"></tr></thead>
                    <tbody id="main_tbody"></tbody>
                </table>
            </div>
        </div>
    `
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
        let tHeadRow = $('#main_thead-tr')
        miNombre = data.nombres
        for(let i=0;data.headers.length>i;i++){
            let th = document.createElement('th')
            th.textContent = data.headers[i]
            if(data.headers[i]=='id'||data.headers[i]=='stock'||data.headers[i]=='Categoría'||data.headers[i]=='cantidad'||data.headers[i]=='Precio'){th.classList.add('hidden')}
            // if(data.headers[i]=='Precio'){th.classList.add('text-align-center')}
            tHeadRow.append(th)
        }
        $('#main_tbody').append(data.html)
        let tableRows = document.querySelectorAll('#orden')
        tableRows.forEach(tr =>{
            tr.children[3].classList.add('hidden')
            if(tr.children[5].textContent==0){
                tr.style.backgroundColor = '#f12929'
                tr.style.color = 'white'
            }
        })
        mainTable = document.querySelector('table#main_table')
        categories = mainTable.querySelectorAll('td.cat-selector')
        filterCategoriesToOnlyDisplayCategory(1)
    })
    $.post('/mesero-load_categories').done(( data ) => {
        let cat_div = document.querySelector('.horizontal-div')
        for(let i=0;data.length>i;i++){
            let category = document.createElement('div')
            category.setAttribute('categoria', data[i].ID)
            category.classList = 'category category-cocina-colors'
            category.textContent = data[i].nombre_de_categoria
            cat_div.append(category)
        }
    })
}
function filterCategoriesToOnlyDisplayCategory(id){
        categories.forEach(categoria =>{
            if(categoria.textContent!=id){
                categoria.parentElement.style.display='none'
            }else{
                categoria.parentElement.style.display=null
            }
        })
}