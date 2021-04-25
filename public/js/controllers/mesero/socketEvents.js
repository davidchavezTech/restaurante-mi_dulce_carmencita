socket.on('Nueva orden lista - cocina', function(mesaID) {
    let foundElement = document.getElementById(mesaID)
    if(!foundElement) return
    foundElement = foundElement.children[0]
    foundElement.classList.remove('gray-out')
    foundElement.classList.remove('orange')
    foundElement.classList.add('red')
})
socket.on('Nuevo plato listo - cocina', function(tableID_and_dish_name) {
    
    let foundElement = document.getElementById(tableID_and_dish_name[0])
    if(!foundElement) return
    foundElement = foundElement.children[0]
    foundElement.classList.remove('gray-out')
    foundElement.classList.add('orange')
    let tableBody = foundElement.nextElementSibling.querySelector('#main_tbody')
    let tableRows = tableBody.querySelectorAll('tr')
    for(let i=0;tableRows.length>i;i++){
        if(tableRows[i].children[1].textContent==tableID_and_dish_name[1]){
            tableRows[i].style.backgroundColor = '#8ef36d'
            i=tableRows.length
        }
    }
       
  

})

socket.on('cambio de stock - cocina', function(platoID_and_stock_state) {
    let trs = document.querySelectorAll('#orden')
    trs.forEach(tr =>{
        if(tr.children[0].textContent==platoID_and_stock_state.ID&&platoID_and_stock_state.stock==0){
            tr.style.backgroundColor = '#f12929'
            tr.style.color = 'white'
        }else if(tr.children[0].textContent==platoID_and_stock_state.ID&&platoID_and_stock_state.stock==1){
            tr.style.backgroundColor = ''
            tr.style.color = ''
        }
    })
})