let checkLocalStorage
let session=localStorage.getItem('session')

if(!window.location.href!='http://localhost:4000/' && !localStorage.getItem('session')){
    window.location.href="http://localhost:4000/"
}