import request from "./request.js";

//  get user info request
export const getUserInfo = (userId) => {
 request(`/user/${userId}`).then((res) => {
        console.log(res);
    })

}
