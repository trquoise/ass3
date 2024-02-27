import request from "./request.js";


// Register event
document.querySelector('#reg-button').addEventListener('click',function(){
    const email = document.getElementById("reg-email").value;
    const name = document.getElementById("reg-name").value;
    const password = document.getElementById("reg-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    if (password !== confirmPassword) {
        showError("Passwords do not match");
        return;
      }
    else
    register({email , name , password})
});



// Register interface

function register(data) {
  request("/auth/register", data, {method:'post'})
      .then(res => {
        alert("Register success");
        window.location.hash = '#/login';
      });
}
