const localStorageToken = JSON.parse(localStorage.getItem('JWT'))

let checkLocalStorage, errorMsgTextContainer, errorModal, errrorAceptBtn
// if(window.location.pathname == '/') document.getElementsByTagName("body")[0].style.style.overflow = 'hidden'

//send user to login if no JWT in local storage AND not in loggin page
if(window.location.href!='http://' + window.location.hostname + ':4000/' && !localStorageToken){
    window.location.href="http://" + window.location.hostname + ":4000/"
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
                console.log(data)
                if(data){//We have the correct token
                    if(window.location.href == 'http://' + window.location.hostname + ':4000/'){//if we are in homepage/login page, then send to dashboard, else, cont
                    window.location.href='http://' + window.location.hostname + ':4000' + data[0]
                    // return false;
                    }
                    window.document.title = data
                }
                else{//wrong token, remove it from local storage and redirect to login page
                    logout()
                }
            });
        }
        
}
$(document).ready(function(){
    $('#log_out_button').click(function(){
        localStorage.removeItem('JWT')
        window.location.href='http://' + window.location.hostname + ':4000/'
    })
    document.getElementById('logoutBtn').addEventListener('click', ()=>{
        logout()
    })

    errorModal = document.getElementById("error-modal_error_display");
    errrorAceptBtn = document.getElementById("error-accept_btn");
    errorMsgTextContainer= document.getElementById("error-msg");
    errrorAceptBtn.addEventListener('click', ()=>{
        errorModal.style.display = "none";
    })
    if(window.location.href != 'http://' + window.location.hostname + ':4000/'){
        document.getElementById('logoutBtn').style.display = 'block'
    }
})
function showError(errorMsg){
    errorMsgTextContainer.textContent = errorMsg
    errorModal.style.display = "block";
    
}

function logout(){
    localStorage.removeItem('JWT');
    window.location.href = 'http://' + window.location.hostname + ':4000/';
}