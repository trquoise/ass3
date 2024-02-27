

//Mock Page Challenge Request
// function showHomePage() {
//     document.querySelector(".page.home").style.display = "block";
//     document.querySelector(".page.register").style.display = "none";
//     document.querySelector(".page.login").style.display = "none";
//     document.querySelector(".page.channel").style.display = "none";
//     document.querySelector(".page.createChannel").style.display = "none";
//   }

  import {fetchChannelList} from "./channel.js";
import request from "./request.js";

function showRegisterPage() {
    document.querySelector(".page.register").style.display = "block";
    document.querySelector(".page.login").style.display = "none";
    document.querySelector(".page.channel").style.display = "none";
    document.querySelector(".page.createChannel").style.display = "none";
    document.querySelector(".page2.message").style.display='none';
  }

  function showLoginPage() {
    document.querySelector(".page.register").style.display = "none";
    document.querySelector(".page.login").style.display = "block";
    document.querySelector(".page.channel").style.display = "none";
    document.querySelector(".page.createChannel").style.display = "none";
    document.querySelector(".page2.message").style.display='none';

  }

export function renderUserImg(){
  request(`/user/${localStorage.getItem("userId")}`).then((res) => {
    const userImg=document.getElementById("user-logo")
    const userImg2=document.getElementById("user-logo2")
    if(res.image!==null){
      userImg.setAttribute('src',res.image)
      userImg2.setAttribute('src',res.image)
    }
    else{
      userImg.setAttribute('src',"./img/head.png")
      userImg2.setAttribute('src',"./img/head.png")
    }
  });
}

  function showChannelPage() {
    document.querySelector(".page.register").style.display = "none";
    document.querySelector(".page.login").style.display = "none";
    document.querySelector(".page.createChannel").style.display = "none";
    document.querySelector(".page2.message").style.display='none';
    document.querySelector(".page.channel").style.display = "block";
    fetchChannelList()
    renderUserImg()
}
  function showCreateChannelPage() {
    // document.querySelector(".page.home").style.display = "none";
    document.querySelector(".page.register").style.display = "none";
    document.querySelector(".page.login").style.display = "none";
    document.querySelector(".page.channel").style.display = "none";
    document.querySelector(".page2.message").style.display='none';
    document.querySelector(".page.createChannel").style.display = "block";
    renderUserImg()
}



function showMessagePage() {
  // document.querySelector(".page.home").style.display = "none";
  document.querySelector(".page.register").style.display = "none";
  document.querySelector(".page.login").style.display = "none";
  document.querySelector(".page.channel").style.display = "none";
  document.querySelector(".page.createChannel").style.display = "none";
  document.querySelector(".page2.message").style.display='block';
  renderUserImg()
}
window.onload = function () {
    // If there is no token, log in
    console.log(localStorage.getItem('token'))
    if (localStorage.getItem('token')) {
      window.history.pushState(null, "", '#channel');
        showChannelPage();
    } else {
      window.history.pushState(null, "", '#login');
        showLoginPage();
    }
  }

  //listen hash change
  window.onhashchange = function(){
    const hash = window.location.hash;
    switch (hash) {
      case "#login":
        showLoginPage();
        break;
      case "#register":
        showRegisterPage();
        break;
      case "#channel":
        showChannelPage();
        break;
      case "#createChannel":
        showCreateChannelPage();
        break;
      case "#message":
        showMessagePage();
        break;
    }
  }

