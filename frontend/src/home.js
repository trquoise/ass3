import request  from "./request.js";
import { createChannel, fetchChannelList } from "./channel.js";

  // console.log(123123123);

// if (document.querySelector('.page_container')) {
//   fetchChannelList()
// }

document.querySelector('#goto_create_button')?.addEventListener('click', function () {
  window.location.hash = '#createChannel'
});

document.querySelector('.logout_btn')?.addEventListener('click', function () {
    logout()
});

const logout = () => {
   request("/auth/logout", {}, {method:'post'})
    .then(res => {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("userId");
        window.localStorage.removeItem("userInfo");
        window.location.hash = '#login'
      });
}
