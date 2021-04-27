let mainContainer = document.getElementById('main-container')
let tabs = document.querySelectorAll('.nav-link')
function navBarClicked(clickedElement){
    if(clickedElement.classList.contains('active')) return
    mainContainer.innerHTML = ''
    tabs.forEach(tab =>{
        tab.classList.remove('active')
    })
    clickedElement.classList.add('active')
    
    if(clickedElement.textContent=='Excel'){
        mainContainer.innerHTML = `
            <br>
            <h2 style="margin-left: 25px;">Generar:</h2>
            <br>
            <br>
            <div class='buttons-container'>
                <button id='excel-button'type="button" class="btn btn-primary">Reporte de atenciones</button><br><br>
                <button id='excel-button'type="button" class="btn btn-primary">Reporte de comandas</button><br><br>
                <button id='excel-button'type="button" class="btn btn-primary">Reporte de cuadre de caja</button><br><br>
                <button id='excel-button'type="button" class="btn btn-primary">Reporte de productos vendidos</button><br><br>
            </div>
        `
    }
    else if(clickedElement.textContent=='Usuarios'){
        loadUsuarios()
    }
    else if(clickedElement.id=='platos'){
        loadPlatos()
    }
}
