function setStock(clickedElement){
    let stock = clickedElement.parentElement.children[5].textContent
        if(stock==1){stock=0}
        else if(stock==0){stock=1}
    let data = {stock, ID:clickedElement.parentElement.children[0].textContent}
    $.post('/cocina-set_stock', data).done(( newStockState ) => {
        console.log(newStockState)
        if(!newStockState) return
        if(stock==0){
            clickedElement.parentElement.children[5].textContent = 0
            clickedElement.parentElement.style.backgroundColor = '#f12929'
            clickedElement.parentElement.style.color = 'white'
        }else if(stock==1){
            clickedElement.parentElement.children[5].textContent = 1
            clickedElement.parentElement.style.backgroundColor = ''
            clickedElement.parentElement.style.color = ''
        }
        let platoID=clickedElement.parentElement.children[0].textContent
        let platoID_and_stock_state = {ID: platoID, stock}
        emmitStockState(platoID_and_stock_state)
    })
}