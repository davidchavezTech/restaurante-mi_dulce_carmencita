let excelErrorMsg = document.querySelector('#error-excel')
// function randomDate(start, end) {
// 	var d= new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
// 	return d;
// }

function excel_generate_reporteDeAtenciones(SheetTitle, dateRange){

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
    $.post('/excel-R_atenciones', data).done(( data ) => {
		console.log(data)
		if(data==false){
				excelErrorMsg.textContent = "No se encontraron registros entre esas fechas"
				excelErrorMsg.style.display = 'block'
				return
		}
		excelErrorMsg.style.display = 'none'
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
		// excel.addSheet("Sheet 2");
		
		
		// excel.set(0,8,1,15);		
		// excel.set(0,8,2,13);		
		// excel.set(0,7,3,"15+13");		
		// excel.set(0,8,3,"=I2+I3");		

		
		var evenRow=excel.addStyle ( { 																	// Style for even ROWS
			border: "none,none,none,thin #333333"});													// Borders are LEFT,RIGHT,TOP,BOTTOM. Check $JExcel.borderStyles for a list of valid border styles

		var oddRow=excel.addStyle ( { 																	// Style for odd ROWS
			fill: "#ECECEC" , 																			// Background color, plain #RRGGBB, there is a helper $JExcel.rgbToHex(r,g,b)
			border: "none,none,none,thin #333333"}); 
		
		
		for (var i=1;i<data.length;i++) excel.set({row:i,style: i%2==0 ? evenRow: oddRow  });				// Set style for the first 50 rows
		
		// excel.set({row:3,value: 30  });																	// We want ROW 3 to be EXTRA TALL

		var headers=["Fecha", "Hora", "Estado", "Mesero", "Cajero","Efectivo","Tarjeta","Yape", "Total"];							// This array holds the HEADERS text
		var formatHeader=excel.addStyle ( { 															// Format for headers
				border: "none,none,none,thin #333333", 													// 		Border for header
				font: "Calibri 12 #03bafc B"}); 														// 		Font for headers

		for (var i=0;i<headers.length;i++){																// Loop all the headers
			excel.set(0,i,0,headers[i],formatHeader);													// Set CELL with header text, using header format
			excel.set(0,i,undefined,"auto");															// Set COLUMN width to auto (according to the standard this is only valid for numeric columns)
		}
		
		
		// Now let's write some data
		// var initDate = new Date(2000, 0, 1);
		// var endDate = new Date(2016, 0, 1);
		// var dateStyle = excel.addStyle ( { 																// Format for date cells
		// 		align: "R",																				// 		aligned to the RIGHT
		// 		format: "yyyy.mm.dd hh:mm:ss", 															// 		using DATE mask, Check $JExcel.formats for built-in formats or provide your own 
		// 		font: "#00AA00"}); 																		// 		in color green
		
		// for (var i=1;i<50;i++){																			// we will fill the 50 rows
		// 	excel.set(0,0,i,"This is line "+i);															// This column is a TEXT
		// 	var d=randomDate(initDate,endDate);															// Get a random date
		// 	excel.set(0,1,i,d.toLocaleString());														// Store the random date as STRING
		// 	excel.set(0,2,i,$JExcel.toExcelLocalTime(d));												// Store the previous random date as a NUMERIC (there is also $JExcel.toExcelUTCTime)
		// 	excel.set(0,3,i,$JExcel.toExcelLocalTime(d),dateStyle);										// Store the previous random date as a NUMERIC,  display using dateStyle format
		// 	excel.set(0,4,i,"Some other text");															// Some other text
		// 	}
		
		for (var i=0;i<data.length;i++){
			for (var key in data[i][0]) {
				if(data[i][0][key]==null) data[i][0][key]='NO'
			}
			let fecha = data[i][0].created_at.slice(0, 10)
			var arr = fecha.split("-"); 
            fecha = arr[2]+'-'+arr[1]+'-'+arr[0]
			let hora = data[i][0].created_at.slice(11, 16)
			excel.set(0,0,i+1,fecha)
			excel.set(0,1,i+1,hora)
			if(data[i][0].procesada==0) data[i][0].procesada = 'No fue procesada'
			excel.set(0,2,i+1,data[i][0].procesada)
			excel.set(0,3,i+1,data[i][0].mesero)
			excel.set(0,4,i+1,data[i][0].cajero)
			excel.set(0,5,i+1,data[i][0].efectivo)
			excel.set(0,6,i+1,data[i][0].tarjeta)
			excel.set(0,7,i+1,data[i][0].yape)
			excel.set(0,8,i+1,data[i][0].total)
																					// we will fill the 50 rows
			// excel.set(0,0,i,"This is line "+i);															// This column is a TEXT
			// var d=randomDate(initDate,endDate);															// Get a random date
			// excel.set(0,1,i,d.toLocaleString());														// Store the random date as STRING
			// excel.set(0,2,i,$JExcel.toExcelLocalTime(d));												// Store the previous random date as a NUMERIC (there is also $JExcel.toExcelUTCTime)
			// excel.set(0,3,i,$JExcel.toExcelLocalTime(d),dateStyle);										// Store the previous random date as a NUMERIC,  display using dateStyle format
			// excel.set(0,4,i,"Some other text");															// Some other text
		}

		// const mergedCellStyle = excel.addStyle( {align:"C", font: "Calibri 12 #0000AA B"});
		// excel.set(0, 0, 50, "This cells are merged!", mergedCellStyle, 5);								// This cells are merged using colspan

		excel.set(0,0,undefined,22);																	// Set COLUMN 1 to 30 chars width
		// excel.set(0,3,undefined,30);																	// Set COLUMN 3 to 20 chars width
		// excel.set(0,4,undefined,20, excel.addStyle( {align:"R"}));										// Align column 4 to the right
		// excel.set(0,1,3,undefined,excel.addStyle( {align:"L T"}));										// Align cell 1-3  to LEFT-TOP
		// excel.set(0,2,3,undefined,excel.addStyle( {align:"C C"}));										// Align cell 2-3  to CENTER-CENTER
		// excel.set(0,3,3,undefined,excel.addStyle( {align:"R B"}));										// Align cell 3-3  to RIGHT-BOTTOM
		excel.generate(`${SheetTitle}.xlsx`);
    })

	
}