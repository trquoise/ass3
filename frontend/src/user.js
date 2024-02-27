import request from "./request.js";

document.getElementById("user-logo").addEventListener('click', function() {
    document.getElementById("user-info").style.display="block"
    showUserInfo(localStorage.getItem("userId").toString())
});

document.getElementById("close_button4").addEventListener('click', function() {
    document.getElementById("user-info").style.display="none"
});

document.getElementById("close_button6").addEventListener('click', function() {
    document.getElementById("user-info3").style.display="none"
});

// add event for update user info btn
document.getElementById("update_user_button").addEventListener('click', function() {
    const username=document.getElementById("user-name")
    const userbio=document.getElementById("user-bio")
    const useremail=document.getElementById("user-email")
    const userPassword=document.getElementById("user-password")

    const name=username.value
    const bio=userbio.value
    const email=useremail.value
    const password=userPassword.value

    const data={
        email:email,
        bio:bio,
        name:name,
        password:password
    }

    request("/user", data, { method:'put'}).then((res) => {
        alert("user info update success!")
        location.reload()
    })
});


document.getElementById("user-logo2").addEventListener('click', function() {
    document.getElementById("user-info2").style.display="block"
    showUserInfo(localStorage.getItem("userId").toString())
});

document.getElementById("close_button5").addEventListener('click', function() {
    document.getElementById("user-info2").style.display="none"
});

document.getElementById("update_user_button2").addEventListener('click', function() {
    const username=document.getElementById("user-name2")
    const userbio=document.getElementById("user-bio2")
    const useremail=document.getElementById("user-email2")
    const userPassword=document.getElementById("user-password2")

    const name=username.value
    const bio=userbio.value
    const email=useremail.value
    const password=userPassword.value

    const data={
        email:email,
        bio:bio,
        name:name,
        password:password
    }

    request("/user", data, { method:'put'}).then((res) => {
        alert("user info update success!")
        location.reload()
    })
});

// get user info from backend and show them
export function showUserInfo (userId) {
    request(`/user/${userId}`).then((res) => {
        const username=document.getElementById("user-name")
        const userbio=document.getElementById("user-bio")
        const useremail=document.getElementById("user-email")

        const username2=document.getElementById("user-name2")
        const userbio2=document.getElementById("user-bio2")
        const useremail2=document.getElementById("user-email2")

        const username3=document.getElementById("user-name3")
        const userbio3=document.getElementById("user-bio3")
        const useremail3=document.getElementById("user-email3")

        const userImg1=document.getElementById("user-info-img1")
        const userImg2=document.getElementById("user-info-img2")
        const userImg3=document.getElementById("user-info-img3")

        username.value=res.name
        userbio.value=res.bio
        useremail.value=res.email

        username3.textContent=res.name
        userbio3.textContent=res.bio
        useremail3.textContent=res.email

        username2.value=res.name
        userbio2.value=res.bio
        useremail2.value=res.email

        if(res.image!==null){
            userImg2.setAttribute('src',res.image)
            userImg3.setAttribute('src',res.image)
            userImg1.setAttribute('src',res.image)
        }
        else {
            userImg2.setAttribute('src',"./img/head.png")
            userImg3.setAttribute('src',"./img/head.png")
            userImg1.setAttribute('src',"./img/head.png")
        }

    });
}


