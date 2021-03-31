const localStorageToken = JSON.parse(localStorage.getItem('JWT'))

let checkLocalStorage


//send user to login if no JWT in local storage AND not in loggin page
if(window.location.href!='http://localhost:4000/' && !localStorageToken){
    window.location.href="http://localhost:4000/"
}else{
    

        if(localStorageToken){//check if we have a token
            //We have a token in local storage, authenticate token to load rest of the page
            const data = {
                url: window.location.href,
                type: 'POST',
                contentType: 'application/json',
                headers: {
                    'Authorization': 'Bearer '+localStorageToken.accessToken
                },
            }
            //Authenticate user - send JWT from local storage and act depending on response
            $.post('/authenticate', data).done(( data ) => {
                
                if(data == 'Correct JWT'){//We have the correct token
                    if(window.location.href == 'http://localhost:4000/'){//if we are in homepage/login page, then send to dashboard, else, cont
                    window.location.href='http://localhost:4000/inicio'
                    }
                }else{//wrong token, remove it from local storage and redirect to login page
                    localStorage.removeItem('JWT');
                    window.location.href == 'http://localhost:4000/';
                }
            });
        }
        
}
$(document).ready(function(){
    $('#log_out_button').click(function(){
        localStorage.removeItem('JWT')
        window.location.href='http://mydataio.com/'
    })
})