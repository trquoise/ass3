import {fileToDataUrl} from "./helpers.js";
import request from "./request.js";
import {fetchChannelMessage} from "./message.js";

// send msg file
const fileInput = document.getElementById('imgSender');
fileInput.onchange = (event) => {
    const file = event.target.files[0];
    if (file) {
        fileToDataUrl(file)
            .then((dataUrl) => {

                const data = {
                    message: "",
                    image: dataUrl,
                };

                request(`/message/${window.__ACTIVE_CHANNEL_ID__}`, data, {method:'post'})
                    .then(res => {
                        alert("send img message success!");
                        fetchChannelMessage(window.__ACTIVE_CHANNEL_ID__,0);
                    });

            })
            .catch((error) => {
                console.error(error);
            });
    }
};

// update user info
const fileInput2 = document.getElementById('imgSender2');
fileInput2.onchange = (event) => {
    const file = event.target.files[0];
    if (file) {
        fileToDataUrl(file)
            .then((dataUrl) => {

                const data = {
                    image: dataUrl,
                };

                request("/user", data, { method:'put'}).then((res) => {
                    alert("user info update success!")
                    location.reload()
                })

            })
            .catch((error) => {
                console.error(error);
            });
    }
};

const fileInput3 = document.getElementById('imgSender3');
fileInput3.onchange = (event) => {
    const file = event.target.files[0];
    if (file) {
        fileToDataUrl(file)
            .then((dataUrl) => {

                const data = {
                    image: dataUrl,
                };

                request("/user", data, { method:'put'}).then((res) => {
                    alert("user info update success!")
                    location.reload()
                })

            })
            .catch((error) => {
                console.error(error);
            });
    }
};

