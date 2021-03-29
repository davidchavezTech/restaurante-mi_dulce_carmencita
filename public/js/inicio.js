session = JSON.parse(session)
console.log(session)
$.post('/inicio', {permission:session.set_permission}).done(( data ) => {
    if(session.set_permission=='e3h45'){
        $('#admin_tbody').append(data)

        $('#admin_table').DataTable({
            "search": {
                "smart": false
            }
            });

    }
    console.log(data)
});