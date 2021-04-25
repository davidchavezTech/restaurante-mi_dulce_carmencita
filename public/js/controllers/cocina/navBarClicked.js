function navBarClicked(clickedElement){
    if(clickedElement.classList.contains('active')) return
    active_ordersContainer.innerHTML = ''
    tabs.forEach(tab =>{
        tab.classList.remove('active')
    })
    clickedElement.classList.add('active')
    //0 means get the ones that are not procesadas, 1 gets the ones that ARE procesadas
    if(clickedElement.id=='por_procesar'){getTodaysOrders(0)}
    else if(clickedElement.id=='procesadas'){getTodaysOrders(1)}
    else if(clickedElement.id=='platos'){
        loadPlatos()
    }
}