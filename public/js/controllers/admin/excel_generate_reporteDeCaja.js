function excel_generate_reporteDeCaja(SheetTitle, dateRange){

	let date1 = document.querySelector('#de')
	let date2 = document.querySelector('#hasta')
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
    $.post('/excel-R_caja', data).done(( data ) => {
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
		let sheetName = `Cuadre de caja - ${currentDate}`
		excel.set( {sheet:0,value:sheetName} );
	

		
        var evenRow=excel.addStyle ( { 																	// Style for even ROWS
			border: "none,none,none,thin #333333"});													// Borders are LEFT,RIGHT,TOP,BOTTOM. Check $JExcel.borderStyles for a list of valid border styles

		var oddRow=excel.addStyle ( { 																	// Style for odd ROWS
			fill: "#e6eff5" , 																			// Background color, plain #RRGGBB, there is a helper $JExcel.rgbToHex(r,g,b)
			border: "none,none,none,thin #333333"}); 

		var Style_Money = excel.addStyle ( { 									
			align: "R",													
			format: '#,##0.00', 															 
			font: "#00AA00"}); 																		

		var Style_Money_black = excel.addStyle ( { 									
			align: "R",													
			format: '#,##0.00'}); 																		
		
		var Style_Total = excel.addStyle ( { 																
				align: "R",																				
				format: '#,##0.00', 
				fill: "#ebbd28" ,															
				font: "#6e300e"}); 	

		var Style_Red = excel.addStyle ( { 																
				align: "R",																				
				format: '#,##0.00', 
				fill: "#ff0d0d" ,															
				font: "#ffffff"}); 	
		
		for (var i=1;i<data.length+1;i++) excel.set({row:i,style: i%2==0 ? evenRow: oddRow  });				

		var headers=["Fecha", "Hora de apertura", "Hora de cierre", "Cajero", "Aperturó con:", "Ingresos en efectivo", "Cerró caja con:","Monto Correcto", "Ingresos por Tarjeta","Ingresos por Yape","Ingresos Totales del día"];							
		var formatHeader=excel.addStyle ( { 															
				border: "none,none,none,thin #333333", 													
				font: "Calibri 12 #03bafc B"}); 														

		for (var i=0;i<headers.length;i++){																
			excel.set(0,i,0,headers[i],formatHeader);													
			excel.set(0,i,undefined,"auto");															
		}
		
        let columnCounter = 0
        let rowCounter = 1
		for (var i=0;i<data.length;i++){
			for (var key in data[i]) {
				if(data[i][key]==null) data[i][key]=0
			}
			let fecha = data[i].date.slice(0, 10)
			var arr = fecha.split("-"); 
            fecha = arr[2]+'-'+arr[1]+'-'+arr[0]
			let horaAbrirCaja = data[i].horaAbrirCaja.slice(0, 5)
			let horaCerrarCaja = data[i].horaCerrarCaja.slice(0, 5)
			excel.set(0,columnCounter++,rowCounter,fecha)
			excel.set(0,columnCounter++,rowCounter,horaAbrirCaja)
			excel.set(0,columnCounter++,rowCounter,horaCerrarCaja)
			excel.set(0,columnCounter++,rowCounter,data[i].cajero)
			excel.set(0,columnCounter++,rowCounter,data[i].abrir, Style_Money)
			excel.set(0,columnCounter++,rowCounter,data[i].ingresos, Style_Money)
            let montoCorrecto = data[i].abrir + data[i].ingresos
            if(data[i].cerrar!=montoCorrecto)excel.set(0,columnCounter++,rowCounter,data[i].cerrar,Style_Red)
			else excel.set(0,columnCounter++,rowCounter,data[i].cerrar, Style_Money)
			let faltaPlata
			if(data[i].cerrar<data[i].abrir){
				faltaPlata = data[i].cerrar-data[i].abrir
				excel.set(0,columnCounter-1,rowCounter,faltaPlata,Style_Red)
			}
			excel.set(0,columnCounter++,rowCounter,montoCorrecto, Style_Money_black)

			excel.set(0,columnCounter++,rowCounter,data[i].Tarjeta, Style_Money)
			excel.set(0,columnCounter++,rowCounter,data[i].Yape, Style_Money)

            let ingresosTotales = data[i].ingresos + data[i].Tarjeta + data[i].Yape

			excel.set(0,columnCounter++,rowCounter,ingresosTotales, Style_Money)
            if(faltaPlata){
				let nuevosIngresos= (data[i].ingresos*-1)+faltaPlata + data[i].Tarjeta + data[i].Yape
				excel.set(0,columnCounter-1,rowCounter,nuevosIngresos, Style_Money)
			}
			columnCounter = 0
            rowCounter ++
		}
		//add "Cerró caja con"
		excel.set(0,6,data.length+1,`=SUM(G2:G${data.length+1})`, Style_Total)
		//add "Monto Correcto"
		excel.set(0,7,data.length+1,`=SUM(H2:H${data.length+1})`, Style_Total)

		excel.set(0,4,data.length+3,'Ingresos Correctos')
		// console.log(`=SUMA(F2:F${data.length+1};J2:J${data.length+1};I2:I${data.length+1})`)
		// let sumaParaExcel = `=SUMA(F2:F${data.length+1};J2:J${data.length+1};I2:I${data.length+1})`
		let sumaParaExcel = `=SUM(F2:F${data.length+1},I2:I${data.length+1},J2:J${data.length+1})`
		excel.set(0,5,data.length+3,sumaParaExcel, Style_Money)

		excel.set(0,4,data.length+4,'Ingresos Reales')
		excel.set(0,5,data.length+4,`=(G${data.length+2}-H${data.length+2})+SUM(F2:F${data.length+1},I2:I${data.length+1},J2:J${data.length+1})`, Style_Money)
		
        excel.set(0,4,data.length+5,'Discrepancia')
        // let ingresosCorrectos = 0
        // for(let i=0;data.length>i;i++){
        //     ingresosCorrectos += data[i].ingresos
        // }
        // let ingresosReales = 0
        // for(let i=0;data.length>i;i++){
        //     ingresosReales+=(data[i].cerrar - data[i].abrir)
        // }
        // if(ingresosCorrectos!=ingresosReales) excel.set(0,5,data.length+5,`=K${data.length+4}-K${data.length+5}`, Style_Red)
		// else excel.set(0,5,data.length+5,`=K${data.length+4}-K${data.length+5}`)
		excel.set(0,5,data.length+5,`=F${data.length+5}-F${data.length+4}`)
        excel.set(0,5,undefined,22);
        excel.set(0,8,undefined,22);
        excel.set(0,9,undefined,22);
        excel.set(0,10,undefined,25);
		excel.generate(`${currentDate} - Reporte de Caja.xlsx`);
    })

	
}