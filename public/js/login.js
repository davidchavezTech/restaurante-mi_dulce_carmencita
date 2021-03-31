$('form').on('submit', (e) =>{
    e.preventDefault();

    const email = $('#FormControlemail').val().trim();
    const password = $('#FormControlpassword').val().trim();

    const data = {
        email,
        password
    };

    $.post('/login', data).done(( data ) => {
        console.log(data)
        if(data=='Not allowed'){
            $('#error-message').html('Error, favor de intentar de nuevo')
        }else{
            localStorage.setItem('JWT', JSON.stringify(data));
            window.location.href="http://localhost:4000/inicio";
        }
    });
})