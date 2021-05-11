function processPlate(clickedElement){
    clickedElement.closest('tr').style.backgroundColor = ''
    clickedElement.disabled = true;
    let tableID = clickedElement.closest('.ordenes-card').children[0].children[0].textContent
    tableID = tableID.split(" ").splice(-1)
    let dish_name = clickedElement.closest('tr').children[0].textContent
    tableID_and_dish_name = [tableID[0], dish_name]
    emmitPlatoCompleto(tableID_and_dish_name)
}