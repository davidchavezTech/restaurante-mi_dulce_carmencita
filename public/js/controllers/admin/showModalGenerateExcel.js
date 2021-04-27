excelErrorMsg = document.querySelector('#error-excel')
function showModalGenerateExcel(clickedElement){
    let modalTitle = clickedElement.closest('.custom-modal-content2').children[1].textContent
    let de = document.querySelector('#de').value
    let hasta = document.querySelector('#hasta').value

    if(de.value==''||hasta.value=='') return excelErrorMsg.style.display = 'block'
    if (modalTitle=='Generar reporte de atenciones') excel_generate_reporteDeAtenciones('Reporte de atenciones', {de, hasta})
    else if (modalTitle=='Generar reporte de comandas') excel_generate_reporteDeAtenciones('Reporte de comandas', {de, hasta})
    else if (modalTitle=='Generar reporte de cuadre de caja') excel_generate_reporteDeAtenciones('Reporte de cuadre de caja', {de, hasta})
    else if (modalTitle=='Generar reporte de productos vendidos') excel_generate_reporteDeAtenciones('Reporte de productos vendidos', {de, hasta})
}