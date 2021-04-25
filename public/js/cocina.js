let no_hay_ordenes_msg = document.querySelector('#no_hay_ordenes_msg')
let active_ordersContainer = document.querySelector('#ordenes_container')
let tabs = document.querySelectorAll('.nav-link')
//0 means get the ones that are not procesadas, 1 gets the ones that ARE procesadas
getTodaysOrders(0)
this.addEventListener('click', (e)=>{
    let clickedElement = e.target
    if(clickedElement.id=='orden_lista'){
        clickedElement.classList.add('hidden')
        clickedElement.nextElementSibling.classList.remove('hidden')
    }else if(clickedElement.id=='orden_lista-cancel_button'){
        clickedElement.parentElement.classList.add('hidden')
        clickedElement.parentElement.previousElementSibling.classList.remove('hidden')
    }else if(clickedElement.id=='orden_lista-confirm_button'){
        processOrder(clickedElement)
    }else if(clickedElement.id=='terminado_checkbox'){
        processPlate(clickedElement)
    }else if(clickedElement.classList.contains('nav-link')){
        navBarClicked(clickedElement)
    }else if(clickedElement.classList.contains('category-cocina-colors')){
        filterCategoriesToOnlyDisplayCategory(clickedElement.getAttribute('categoria'))
    }else if(clickedElement.parentElement.id=='orden'){
        setStock(clickedElement)
    }
})
