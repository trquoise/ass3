import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';


// User is or not login
function isLogin() {
    return localStorage.getItem("token") !== null;
}

// format time
export function dateTrans(Da){
    const date = new Date(Da);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

}

export function isStringEmpty(inputString) {
    return /^[\s]*$/.test(inputString);
}



