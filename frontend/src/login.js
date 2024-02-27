import { fetchChannelList } from "./channel.js";
import request from "./request.js"


// Login event
document.querySelector('#login-button')?.addEventListener('click', function() {
    const email = document.querySelector("#login-email")?.value;
    const password = document.querySelector("#login-password")?.value;
    login({email, password})
});

document.getElementById('goreg-button')?.addEventListener('click', function() {
    window.location.hash = '#register'
})



// Login interface

function login(data) {
  request("/auth/login", data, {method:'post'})
    .then(res => {
      alert("Login success");
      window.location.hash = '#channel'
        localStorage.setItem("token", res.token)
      fetchUserInfo(res.userId);
      fetchChannelList()
      });
};

//get user information

export function fetchUserInfo (userId) {
    request(`/user/${userId}`).then((res) => {
        const userInfo = {
            ...res,
            userId,
        };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        localStorage.setItem("userId",userId);
        localStorage.setItem("name",res.name);
    });
}
