const data = {
    url: window.location.href,
    type: 'POST',
    contentType: 'application/json',
    headers: {
        'Authorization': 'Bearer '+localStorageToken.accessToken
    },
}

$.post('/inicio', data).done(( data ) => {
        console.log(data)
        if(data.permission=='admin'){
            let theadRow = $('#main_thead-tr')
            for(let i=0;data.headers.length>i;i++){
                let th = document.createElement('th')
                th.textContent = data.headers[i]
                theadRow.append(th)
            }
            $('#main_tbody').append(data.html)
            $('#main_table').DataTable({
                "search": {
                    "smart": false
                }
            })
        }

})