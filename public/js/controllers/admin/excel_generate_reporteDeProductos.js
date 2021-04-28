function excel_generate_reporteDeProductos(SheetTitle, dateRange){

    let date1 = document.querySelector('#de')
	let date2 = document.querySelector('#hasta')
    let dateStart = date1.value
    let dateEnd = date2.value
	if(dateRange.de==''){
		excelErrorMsg.style.textContent = "Llenar ambos campos"
		excelErrorMsg.style.display = 'block'
	} 
	if(dateRange.hasta==''){
		excelErrorMsg.style.textContent = "Llenar ambos campos"
		excelErrorMsg.style.display = 'block'
	} 
	const data = {
        dateRange,
        url: window.location.href,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer '+localStorageToken.accessToken
        },
    }
    $.post('/excel-R_productos', data).done(( data ) => {
		console.log(data)
		if(data==false){
				excelErrorMsg.textContent = "No se encontraron registros entre esas fechas"
				excelErrorMsg.style.display = 'block'
				return
		}
		excelErrorMsg.style.display = 'none'
		excelModal.style.display = 'none'
        console.log(data)
        date1.value = ''
        date2.value = ''

		var excel = $JExcel.new("Calibri light 10 #333333");			// Default font

		let da = new Date();
		let day = da.getDate()
		let month = da.getMonth()
		let year = da.getFullYear()
		let currentDate  =  `${day}_${month}_${year}`
		let sheetName = `${currentDate} - Venta de productos`
		excel.set( {sheet:0,value:'Venta de productos'} );
	

		
        var evenRow=excel.addStyle ( { 																	// Style for even ROWS
			border: "none,none,none,thin #333333"});													// Borders are LEFT,RIGHT,TOP,BOTTOM. Check $JExcel.borderStyles for a list of valid border styles

		var oddRow=excel.addStyle ( { 																	// Style for odd ROWS
			fill: "#e6eff5" , 																			// Background color, plain #RRGGBB, there is a helper $JExcel.rgbToHex(r,g,b)
			border: "none,none,none,thin #333333"}); 

		var Style_Money = excel.addStyle ( { 									
			align: "R",													
			format: '#,##0.00', 															 
			font: "#00AA00"}); 																		
		
		for (var i=1;i<data.length+1;i++) excel.set({row:i,style: i%2==0 ? evenRow: oddRow  });				

		var headers=["Nombre", "Cantidad", "Precio de Venta", "Costo", "Categoría"];							
		var formatHeader=excel.addStyle ( { 															
				border: "none,none,none,thin #333333", 													
				font: "Calibri 12 #03bafc B"}); 														

		for (var i=0;i<headers.length;i++){																
			excel.set(0,i,1,headers[i],formatHeader);													
			excel.set(0,i+1,undefined,"auto");															
		}
		
        const mergedCellStyle = excel.addStyle( {align:"L", font: "Calibri 12 #0000AA B"});
		let dateArray = dateEnd.split('-')
		// for (let i=0;dateArray.length>i;i++) {
		// 	dateArray.push(dateArray[i])
		// 	dateArray.pop()
		// }
		let newDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`
		
        if(dateStart==dateEnd) excel.set(0, 0, 0, `Productos vendidos el ${newDate}`, mergedCellStyle, 6);	
		else excel.set(0, 0, 0, `Productos vendidos entre ${dateStart} y ${dateEnd}`, mergedCellStyle, 6);	
        // excel.set(0, 0, 0, `Productos vendidos entre ${dateStart} y ${dateEnd}`, mergedCellStyle, 6);	
        let columnCounter = 0
        let rowCounter = 2
		for (var i=0;i<data.length;i++){
			for (var key in data[i]) {
				if(data[i][key]==null) data[i][key]='NO'
			}
			excel.set(0,columnCounter++,rowCounter,data[i].nombre_producto)
			excel.set(0,columnCounter++,rowCounter,data[i].quantity)
			excel.set(0,columnCounter++,rowCounter,data[i].precio_venta, Style_Money)
			excel.set(0,columnCounter++,rowCounter,data[i].costo, Style_Money)
			excel.set(0,columnCounter++,rowCounter,data[i].categoria)
            columnCounter=0
            rowCounter++
        }
		
        excel.set(0,0,undefined,24);
        excel.set(0,4,undefined,22);
		excel.generate(`${sheetName}.xlsx`);
    })

	
}