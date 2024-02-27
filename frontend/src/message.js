import request from "./request.js";
import {dateTrans, isStringEmpty} from "./main.js";
import {getChannelInfo} from "./channel.js";
import {showUserInfo} from "./user.js";

const scroll = document.getElementById('messageList');
let timer;

var messageContent=[];

// add scroll event for messageList
scroll.addEventListener('scroll', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        if (scroll.scrollTop + scroll.clientHeight >= scroll.scrollHeight-1) {
            if(!window.__ALLCLEAR__){
                window.__START_INDEX__ += 25;
                fetchChannelMessageAdd(window.__ACTIVE_CHANNEL_ID__,window.__START_INDEX__);
                alert("loading more messages...")
            }
            else{
                alert("all messages have been loaded")
            }
        }
    }, 500);
});

// add click event for update channel btn
document.getElementById("update_channel_button").addEventListener('click', function() {
    const nameUpdateInput=document.getElementById("channel-update-name");
    const nameUpdate=nameUpdateInput.value;
    const descriptionUpdateInput=document.getElementById("channel-update-description");
    const descriptionUpdate=descriptionUpdateInput.value;
    const data={
        name:nameUpdate,
        description:descriptionUpdate
    }

    fetch(`http://localhost:5005/channel/${window.__ACTIVE_CHANNEL_ID__}`, {
        method: "PUT",
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                console.log(data.error)
            } else {
                    alert("update channel success!")
                    getChannelInfo(window.__ACTIVE_CHANNEL_ID__)
                    const editDialog=document.getElementById("channel-edit")
                    editDialog.style.display='none'
            }
        })
        .catch((error) => {
            console.log(error)
        });

});

document.getElementById("invite_channel_button").addEventListener('click', function() {
    const selectElement = document.getElementById("users");
    const selectedOptions = Array.from(selectElement.selectedOptions);

    const selectedValues = selectedOptions.map(option => option.value);
    for (let i = 0; i < selectedValues.length; i++) {
        const value = selectedValues[i];
        const data = {
            userId:value
        };

        fetch(`http://localhost:5005/channel/${window.__ACTIVE_CHANNEL_ID__}/invite`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error)
                    location.reload()
                } else {
                    alert("invite success!")
                    location.reload()
                    fetchChannelMessage(window.__ACTIVE_CHANNEL_ID__)
                }
            })
            .catch((error) => {
                alert(error)
                location.reload()
            });
    }


});
// add click event for send message btn
document.getElementById("message-send").addEventListener('click', function() {
    const messageInput=document.getElementById("message-input")
    const message=messageInput.value

    if(isStringEmpty(message)){
        alert("message empty!")
        return
    }

    const data={message}
    request(`/message/${window.__ACTIVE_CHANNEL_ID__}`, data, {method:'post'})
        .then(res => {
            alert("send message success");
            fetchChannelMessage(window.__ACTIVE_CHANNEL_ID__,0);
            messageInput.value="";
        });
});

document.getElementById("close_button1").addEventListener('click', function() {
    const editDialog=document.getElementById("message-edit")
    editDialog.style.display='none'
    const channelDialog=document.getElementById("channel-edit")
    channelDialog.style.display='none'
});
document.getElementById("close_button2").addEventListener('click', function() {
    const editDialog=document.getElementById("message-edit")
    editDialog.style.display='none'
    const channelDialog=document.getElementById("channel-edit")
    channelDialog.style.display='none'
});
document.getElementById("close_button3").addEventListener('click', function() {
    const editDialog=document.getElementById("channel-invite")
    editDialog.style.display='none'
});

document.getElementById("update_message_button").addEventListener('click', function() {
    const messageUpdateInput=document.getElementById("message-name");
    const messageUpdate=messageUpdateInput.value;

    if(isStringEmpty(messageUpdate)){
        alert("empty message!")
        return
    }

    for(let i=0;i<messageContent.length;i++){
        if(messageUpdate.toString() === messageContent[i]){
            alert("repeat message!")
            return
        }
    }

    const data={
        message: messageUpdate
    }

    request(`/message/${window.__ACTIVE_CHANNEL_ID__}/${window.__ACTIVE_MESSAGE_ID__}`,data,{method:'put'}).then((res) => {
            alert("update message success")
        fetchChannelMessage(window.__ACTIVE_CHANNEL_ID__)
        messageUpdateInput.value="";
            const editDialog=document.getElementById("message-edit")
            editDialog.style.display='none'
    })

});
//  delete msg event
document.getElementById("delete_message_button").addEventListener('click', function() {

    request(`/message/${window.__ACTIVE_CHANNEL_ID__}/${window.__ACTIVE_MESSAGE_ID__}`,{},{method:'delete'}).then((res) => {
        alert("delete message success")
        fetchChannelMessage(window.__ACTIVE_CHANNEL_ID__)
        const editDialog=document.getElementById("message-edit")
        editDialog.style.display='none'
    })

});

//  create messageList
export function createMessageList (messageList, channelId) {
    const messageListDom = document.getElementById("messageList");
    while (messageListDom.firstChild) {
        messageListDom.removeChild(messageListDom.firstChild);
    }
    const userId = localStorage.getItem('userId')
    messageList.forEach((message) => {
        const messageDom = document.createElement("div");
        messageDom.id = `message_list_${message.id}`;
        messageDom.className = "message-item"
        const messagePic = document.createElement("img");

        request(`/user/${message.sender}`).then((res) => {
            if(res.image !== null){
                messagePic.setAttribute('src',res.image.toString())
            }
            else{
                messagePic.setAttribute('src',"./img/head.png")
            }
        });
        messagePic.classList.add("message-user-logo")
        messagePic.addEventListener("click", function() {
            showUserInfo(message.sender.toString())
            document.getElementById("user-info3").style.display="block"
        });


        const messageFirst = document.createElement("div")


        messageFirst.classList.add("message-first-line")
        messageFirst.appendChild(messagePic)

        const messageSender = document.createElement("div");

        //getUserInfo
        request(`/user/${message.sender}`).then((res) => {
            messageSender.textContent=res.name
        });
        messageSender.classList.add("message-sender")
        const messageSendTime=document.createElement("div");
        messageSendTime.textContent=dateTrans(message.sentAt)
        messageFirst.appendChild(messageSender)
        messageDom.appendChild(messageFirst)

        //image message
        console.log(message.image)
        if(message.image !==undefined ){
            const messageImage=document.createElement('img')
            messageImage.setAttribute('src',message.image.toString())
            messageImage.classList.add("image-message")
            messageImage.addEventListener("click", function() {
                if (this.classList.contains("enlarged")) {
                    this.classList.remove("enlarged");
                } else {
                    this.classList.add("enlarged");
                }
            });
            messageDom.appendChild(messageImage);
        }
        else {
            const messageTitle = document.createElement("h3");
            messageTitle.classList.add("message-title");
            messageTitle.innerText = message.message;
            messageContent.push(message.message)
            messageDom.appendChild(messageTitle);
        }

        const messageEdit=document.createElement("button")
        messageEdit.textContent="edit"
        messageEdit.classList.add("message-edit-button")
        const messagePin=document.createElement("button")
        messagePin.textContent="pin"
        messagePin.classList.add("message-pin-button")

        if(message.pinned){
            messagePin.textContent="unpin"
            messageDom.classList.add("message-pinned")
            messagePin.addEventListener("click", function() {
                unpinTheMessage(message.id)
            });
        }
        else{
            messagePin.addEventListener("click", function() {
                pinTheMessage(message.id)
            });
        }

        const messageButton=document.createElement('div')
        messageButton.classList.add("message-button")

        if(message.sender.toString() === userId.toString()){
            messageEdit.addEventListener("click", function() {
                showEdit(message.id)
            });
            messageButton.appendChild(messageEdit)
        }

        messageButton.appendChild(messagePin)
        messageFirst.appendChild(messageButton)

        messageDom.appendChild(messageSendTime)
        if(message.edited){
            const messageEdit=document.createElement('div')
            messageEdit.textContent="EditedAt: "+dateTrans(message.editedAt)
            messageDom.appendChild(messageEdit)
        }

        let an=0;
        let en=0;
        let fn=0
        for(let j=0;j<message.reacts.length;j++){
            if(message.reacts[j].react.toString()==="🍎".toString())
                an++;
            else if(message.reacts[j].react.toString()==="🌍".toString())
                en++;
            else if(message.reacts[j].react.toString()==="🌺".toString())
                fn++;
        }

        const apple=document.createElement('div')
        apple.textContent="🍎"
        apple.classList.add('react-symbol')
        const appleNum=document.createElement('div')
        appleNum.textContent="x"+an.toString()
        let find=false;
        for(let j=0;j<message.reacts.length;j++){
            if(message.reacts[j].react.toString()==="🍎".toString() && message.reacts[j].user.toString()===userId){
                find=true;
            }
        }
        if(find){
            apple.addEventListener('click', () => {
                const data={
                    react:"🍎".toString(),
                }
                fetch(`http://localhost:5005/message/unreact/${window.__ACTIVE_CHANNEL_ID__}/${message.id}`, {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(data)
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.error) {
                            console.log(data.error)
                        } else {
                            alert("unreact "+"🍎"+" success!")
                            fetchChannelMessage(window.__ACTIVE_CHANNEL_ID__)
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            });
        }
        else{
            apple.addEventListener('click', () => {
                const data={
                    react:"🍎".toString(),
                }
                fetch(`http://localhost:5005/message/react/${window.__ACTIVE_CHANNEL_ID__}/${message.id}`, {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(data)
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.error) {
                            if(data.error){
                                console.log(data.error)
                            }
                        } else {
                            alert("react "+"🍎"+" success!")
                            fetchChannelMessage(window.__ACTIVE_CHANNEL_ID__)
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            });
        }

        const earth=document.createElement('div')
        earth.textContent="🌍"
        earth.classList.add('react-symbol')
        const earthNum=document.createElement('div')
        earthNum.textContent="x"+en.toString()
        find=false;
        for(let j=0;j<message.reacts.length;j++){
            if(message.reacts[j].react.toString()==="🌍".toString() && message.reacts[j].user.toString()===userId){
                find=true;
            }
        }
        if(find){
            earth.addEventListener('click', () => {
                const data={
                    react:"🌍".toString(),
                }
                fetch(`http://localhost:5005/message/unreact/${window.__ACTIVE_CHANNEL_ID__}/${message.id}`, {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(data)
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.error) {
                            console.log(data.error)
                        } else {
                            alert("unreact "+"🌍"+" success!")
                            fetchChannelMessage(window.__ACTIVE_CHANNEL_ID__)
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            });
        }
        else{
            earth.addEventListener('click', () => {
                const data={
                    react:"🌍".toString(),
                }
                fetch(`http://localhost:5005/message/react/${window.__ACTIVE_CHANNEL_ID__}/${message.id}`, {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(data)
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.error) {
                            if(data.error){
                                console.log(data.error)
                            }
                        } else {
                            alert("react "+"🌍"+" success!")
                            fetchChannelMessage(window.__ACTIVE_CHANNEL_ID__)
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            });
        }

        const flower=document.createElement('div')
        flower.textContent="🌺"
        flower.classList.add('react-symbol')
        const flowerNum=document.createElement('div')
        flowerNum.textContent="x"+fn.toString()
        find=false;
        for(let j=0;j<message.reacts.length;j++){
            if(message.reacts[j].react.toString()==="🌺".toString() && message.reacts[j].user.toString()===userId){
                find=true;
            }
        }
        if(find){
            flower.addEventListener('click', () => {
                const data={
                    react:"🌺".toString(),
                }
                fetch(`http://localhost:5005/message/unreact/${window.__ACTIVE_CHANNEL_ID__}/${message.id}`, {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(data)
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.error) {
                            console.log(data.error)
                        } else {
                            alert("unreact "+"🌺"+" success!")
                            fetchChannelMessage(window.__ACTIVE_CHANNEL_ID__)
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            });
        }
        else{
            flower.addEventListener('click', () => {
                const data={
                    react:"🌺".toString(),
                }
                fetch(`http://localhost:5005/message/react/${window.__ACTIVE_CHANNEL_ID__}/${message.id}`, {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(data)
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.error) {
                            if(data.error){
                                console.log(data.error)
                            }
                        } else {
                            alert("react "+"🌺"+" success!")
                            fetchChannelMessage(window.__ACTIVE_CHANNEL_ID__)
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            });
        }

        const reactLine=document.createElement("div")
        reactLine.classList.add("react-line")

        reactLine.appendChild(apple)
        reactLine.appendChild(appleNum)
        reactLine.appendChild(earth)
        reactLine.appendChild(earthNum)
        reactLine.appendChild(flower)
        reactLine.appendChild(flowerNum)

        messageDom.appendChild(reactLine)
        if(message.pinned){
            messageListDom.insertBefore(messageDom,messageListDom.firstChild)
        }
        else
        messageListDom.appendChild(messageDom);
    });


}
// add message list
export function addMessageList (messageList, channelId) {
    const messageListDom = document.getElementById("messageList");
    messageList.forEach((message) => {

        const messageDom = document.createElement("div");
        messageDom.id = `message_list_${message.id}`;
        messageDom.className = "message-item"
        const messageTitle = document.createElement("h3");
        messageTitle.className = "message-title";
        messageTitle.innerText = message.message;
        const messageSender = document.createElement("div");

        //getUserInfo
        request(`/user/${message.sender}`).then((res) => {
            messageSender.textContent=res.name
        });

        const messageSendTime=document.createElement("div");
        messageSendTime.textContent=dateTrans(message.sentAt)

        messageDom.appendChild(messageSender);
        messageDom.appendChild(messageTitle);
        messageDom.appendChild(messageSendTime)
        if(message.edited){
            const messageEdit=document.createElement('div')
            messageEdit.textContent=dateTrans(message.editedAt)
        }


        messageListDom.appendChild(messageDom);
    });


}

// get channel message from backend
export function fetchChannelMessage(channelId, start = 0) {
    request(`/message/${channelId}?start=${start}`).then((res) => {
        window.__ACTIVE_CHANNEL_ID__ = channelId;
        createMessageList(res.messages,channelId);
        if(res.messages.length===0)
            window.__ALLCLEAR__=true
        else
            window.__ALLCLEAR__=false
    })
}

export function fetchChannelMessageAdd(channelId,start){
    request(`/message/${channelId}?start=${start}`).then((res) => {
        if(res.messages.length===0)
            window.__ALLCLEAR__=true
        else
            window.__ALLCLEAR__=false
        addMessageList(res.messages,channelId);
    })
}


export function showEdit(messageId){
    const editDialog=document.getElementById("message-edit")
    editDialog.style.display='block'
    window.__ACTIVE_MESSAGE_ID__=messageId
}

export function pinTheMessage(messageId){
    request(`/message/pin/${window.__ACTIVE_CHANNEL_ID__}/${messageId}`,{},{method:'post'}).then((res) => {
        alert("pin the message success")
        fetchChannelMessage(window.__ACTIVE_CHANNEL_ID__)
        const editDialog=document.getElementById("message-edit")
        editDialog.style.display='none'
    })
}

export function unpinTheMessage(messageId){
    request(`/message/unpin/${window.__ACTIVE_CHANNEL_ID__}/${messageId}`,{},{method:'post'}).then((res) => {
        alert("unpin the message success")
        fetchChannelMessage(window.__ACTIVE_CHANNEL_ID__)
        const editDialog=document.getElementById("message-edit")
        editDialog.style.display='none'
    })
}


