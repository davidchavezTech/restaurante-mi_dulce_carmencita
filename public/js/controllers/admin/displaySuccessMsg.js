let successMsg = document.querySelector('.success-msg')

function displaySuccessMsg(text){
    successMsg.textContent = text
    successMsg.classList.remove('activate-success-msg')
    setTimeout(() => {
        successMsg.classList.add('activate-success-msg')
    }, 100);
}