$('form').on('submit', (e) =>{
    e.preventDefault();

    const email = $('#email').val().trim();
    const password = $('#password').val().trim();

    const data = {
        email,
        password
    };

    $.post('/login', data).done(( data ) => {
        if(data=='wrong'){
            $('#error-message').html('Error, por favor vuelva a intentar')
        }else{
            localStorage.setItem('session', JSON.stringify(data));
            window.location.href="http://localhost:4000/inicio";
        }
    });
})