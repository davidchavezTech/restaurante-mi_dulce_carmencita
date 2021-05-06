function excel_generate_reporteDeComandas(SheetTitle, dateRange){

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
    $.post('/excel-R_comandas', data).done(( data ) => {
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
		let sheetName = `${SheetTitle}-${currentDate}`
		excel.set( {sheet:0,value:sheetName} );
	

		

            
        var Style_ColorRow=excel.addStyle ( { 																	
            fill: "#e6eff5" , 																			
            border: "none,none,none,thin #333333"}); 

		var Style_Money = excel.addStyle ( { 									
			align: "R",													
			format: '#,##0.00', 															 
			font: "#00AA00"}); 																		
		
		var Style_Total = excel.addStyle ( { 																
				align: "R",																				
				format: '#,##0.00', 
				fill: "#ebbd28" ,															
				font: "#6e300e"}); 	

		var Style_Red = excel.addStyle ( { 																
				align: "L",																				
				format: '#,##0.00', 
				fill: "#ff0d0d" ,															
				font: "#ffffff"}); 	
		
		// for (var i=1;i<data.length+1;i++) excel.set({row:i,style: i%2==0 ? evenRow: oddRow  });				

		var headers=["Fecha", "Hora", "Mesero", "Cajero", "Mesa", "Comanda","Cantidad","Precio Unitario","Estado"];							
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
			for (var key in data[i][0]) {
				if(data[i][0][key]==null) data[i][0][key]='NO'
			}
            excel.set({row:rowCounter,style: Style_ColorRow  });	
			let fecha = data[i][0].nombre_producto.slice(0, 10)
			// let fecha = data[i][0].created_at.slice(0, 10)
			var arr = fecha.split("_"); 
            fecha = arr[0]+'-'+arr[1]+'-'+arr[2]
			let hora = data[i][0].created_at.slice(16, 21)
			excel.set(0,columnCounter++,rowCounter,fecha)
			excel.set(0,columnCounter++,rowCounter,hora)
			// if(data[i][0].procesada==0) data[i][0].procesada = 'No fue procesada'
			// else if(data[i][0].procesada==1) data[i][0].procesada = 'Procesada'
			excel.set(0,columnCounter++,rowCounter,data[i][0].mesero)
			// if(data[i][0].preparada==0) data[i][0].preparada = 'No fue Preparada'
			// else if(data[i][0].preparada==1) data[i][0].preparada = 'Preparada'
			excel.set(0,columnCounter++,rowCounter,data[i][0].cajero)
			excel.set(0,columnCounter++,rowCounter,data[i][0].mesa)
            for(let j=1;data[i].length>j;j++){
                columnCounter=5
                excel.set(0,columnCounter++,rowCounter,data[i][j].nombre_producto)
                excel.set(0,columnCounter++,rowCounter,data[i][j].cantidad)
				debugger
                excel.set(0,columnCounter++,rowCounter,data[i][j].precio)
                if(data[i][j].cancelada_pagada==0) {
                    if(rowCounter,data[i][0].cajero=='NO') excel.set(0,columnCounter++,rowCounter,"Sin Procesar", Style_Red)
                    else{
                        data[i][j].cancelada_pagada = 'Cancelada'
                        excel.set(0,columnCounter++,rowCounter,data[i][j].cancelada_pagada, Style_Red)
                    }
                }
                else if(data[i][j].cancelada_pagada==1) {
                    if(rowCounter,data[i][0].cajero=='NO') excel.set(0,columnCounter++,rowCounter,"Sin Procesar", Style_Red)
                    else{
                        data[i][j].cancelada_pagada = 'Pagada'
                        excel.set(0,columnCounter++,rowCounter,data[i][j].cancelada_pagada)
                    }
                }
                rowCounter ++
            }
			columnCounter = 0
            rowCounter ++
		}
		// excel.set(0,10,data.length+1,`=SUM(K2:K${data.length+1},)`, Style_Total)
		// excel.set(0,11,data.length+1,`=SUM(L2:L${data.length+1},)`, Style_Total)
		
		excel.generate(`${currentDate} - Reporte de Comandas.xlsx`);
    })

	
}