function processOrder(clickedElement){
    let tableName = clickedElement.closest('.ordenes-card').getAttribute('table-name')
    let tableID = clickedElement.closest('.ordenes-card').children[0].children[0].textContent
    tableID = tableID.split(" ").splice(-1)
    const data = {
        url: window.location.href,
        type: 'POST',
        headers: {
            'Authorization': 'Bearer '+localStorageToken.accessToken
        },
        tableName
    }

    $.post('/cocina-procesar_orden', data).done(( data ) => {
        console.log(data)
        if(data){
            clickedElement.closest('.ordenes-card').remove()
            emmitOrdenCompleta(tableID[0])
            
            //check if there are orders pending, if not, then show "No hay ordenes para preparar todavía..."
            if(document.getElementById('ordenes_container').children.length==0){
                no_hay_ordenes_msg.innerHTML='<br><br>Ya no hay órdenes para preparar'
                no_hay_ordenes_msg.classList.remove('hidden')
            }
        }
    })
    
}