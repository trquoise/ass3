import { fetchUserInfo } from "./login.js";
import request from "./request.js";
import {fetchChannelMessage, showEdit} from "./message.js";
import {dateTrans} from "./main.js";




document.getElementById("logout-button2").addEventListener('click', function() {
    localStorage.removeItem("token")
    localStorage.removeItem("userInfo")
    alert("logout success!")
    location.reload()
});

document.getElementById("logout-button").addEventListener('click', function() {
    localStorage.removeItem("token")
    localStorage.removeItem("userInfo")
    alert("logout success!")
    location.reload()
});

var joinedList=[];
var unJoinedList=[];

function getJoinedList(channelList){
    const userId=localStorage.getItem("userId")
    let m=0;
    let n=0;
    let j=0;
    let find=false;
    for(let i=0;i<channelList.length;i++){
        find=false;
        for(j=0;j<channelList[i].members.length;j++){
            if(userId.toString() === channelList[i].members[j].toString()) {
                find=true;
                break;
            }
        }
        if(find)
            joinedList[m++]=channelList[i];
        else
            unJoinedList[n++]=channelList[i];
    }
}

export function createChannelList (channelList, channelId) {
  const channelListDom = document.getElementById("channelList");
    while (channelListDom.firstChild) {
        channelListDom.removeChild(channelListDom.firstChild);
    }
  const userId = localStorage.getItem('userId')
    console.log(userId)
    
    getJoinedList(channelList)
    const targetChannelId = channelId || joinedList[0]?.id;
  
    window.__ACTIVE_CHANNEL_ID__ = targetChannelId;

    joinedList.forEach((channel) => {
        const active = channel.id === targetChannelId;
        const channelDom = document.createElement("div");
        channelDom.id = `channel_list_${channel.id}`;
      channelDom.className = active
        ? "channel-item active-channel"
          : "channel-item"
      const privateTag = document.createElement("p");
      privateTag.innerText = `${channel.private?'private':'public'}`
        const channelTitle = document.createElement("h3");
        channelTitle.className = "channel-title";
        channelTitle.innerText = channel.name;
        const leaveBtn = document.createElement("button");
        leaveBtn.className = "btn btn-warning btn-sm del-btn";
        leaveBtn.innerText = "leave";
        leaveBtn.addEventListener("click", function(event) {
            event.stopPropagation();
            leaveChannel(channel.id)
        });
        channelDom.appendChild(channelTitle);
        channelDom.appendChild(privateTag);
        channelDom.appendChild(leaveBtn);
        channelDom.addEventListener("click",() => {
                getChannelInfo(channel.id)
                fetchChannelMessage(channel.id, 0)
                window.__START_INDEX__=0;
        })
        channelListDom?.appendChild(channelDom);
    });

    unJoinedList.forEach((channel) =>{
      const active = channel.id === targetChannelId;
 
        const channelDom = document.createElement("div");
        channelDom.id = `channel_list_${channel.id}`;
        channelDom.className = active
          ? "channel-item active-channel"
          : "channel-item";
        const channelTitle = document.createElement("h3");
        channelTitle.className = "channel-title";
        channelTitle.innerText = channel.name;

      const privateTag = document.createElement("p");
      privateTag.innerText = `${channel.private?'private':'public'}`
        const joinBtn = document.createElement("button");
        joinBtn.className = "btn btn-primary btn-sm join-btn";
        joinBtn.innerText = "join";
        joinBtn.addEventListener("click", function(event) {
            event.stopPropagation();
            joinChannel(channel.id)
        });
        channelDom.appendChild(channelTitle);
        channelDom.appendChild(privateTag);
        channelDom.appendChild(joinBtn);
        channelDom.addEventListener("click",() => {
            alert("please join in the channel first!")
        })
        channelListDom?.appendChild(channelDom);
    });
  

}


function gennerateChannelHeader(detail) {
    const channelHeaderDom = document.getElementById("channelHeader");
   
    const leftContainer = document.createElement("div");
    leftContainer.className = "channel-header-left-container";
    const channelLogo = document.createElement("div");
    channelLogo.className= "channel-logo";

    const channelListLogo = document.querySelector(
        `#channel_list_${detail.id}`
    );
    channelLogo.style.background = channelListLogo.style.background;
    channelLogo.innerText = detail.name[0];
    const channelTitle = document.createElement("h3");
    channelTitle.className = "channel-title";
    channelTitle.innerText = detail.name;
    leftContainer.appendChild(channelLogo);
    leftContainer.appendChild(channelTitle);

    const rightContainer = document.createElement("div");
    rightContainer.className = "channel-header-right-container";
    const infoIcon = document.createElement("i");
    infoIcon.className = "bi bi-info-circle";
    infoIcon.onclick = function () {
        alert("show channel details")
  };
  channelHeaderDom?.appendChild(leftContainer)
}

export function fetchChannelList() {
  request("/channel").then((res) => {
    localStorage.setItem('channelList',JSON.stringify(res.channels))
    createChannelList(res.channels);
      if (res.channels.length) {
        document.querySelector('.nothing').style.display = 'none'
      }
    })
}

export function createChannel(params) {
  request("/channel", params, { method:'post'}).then((res) => {
      console.log(res)
      alert("channel create success!")
      window.location.hash = '#channel'
  })
}

export function leaveChannel (channelId) {
  request(`/channel/${channelId}/leave`, {}, { method:'post'}).then((res) => {
      fetchChannelList()
    alert('leave successfully~')
    })
}

export function joinChannel (channelId) {
  request(`/channel/${channelId}/join`, {}, { method:'post'}).then((res) => {
        console.log('join',res)
    alert('join successfully~')
      fetchChannelList()
    })
}

export function getChannelInfo(channelId){

    request(`/channel/${channelId}`, {}, { method:'get'}).then((res) => {
        // <div className="channel-name" id="channel-name">1</div>
        // <div className="channel-bio" id="channel-bio">2</div>
        // <div className="channel-time" id="channel-time">3</div>
        // <div className="channel-creator" id="channel-creator">4</div>
        const channelname=document.getElementById("channel-name")
        channelname.textContent="channel name: "+res.name
        const channelbio=document.getElementById("channel-bio")
        channelbio.textContent="channel description: "+res.description
        const channeltime=document.getElementById("channel-time")
        channeltime.textContent="channel createdAt: "+dateTrans(res.createdAt)

        request(`/user/${res.creator}`).then((data) => {
            const channelcreator=document.getElementById("channel-creator")
            channelcreator.textContent="channel creator: "+data.name
        });

        const channelEdit=document.getElementById("channel-edit-button")
        channelEdit.addEventListener("click", function() {
                showChannelEdit(channelId)
            });

        const channelInvite=document.getElementById("channel-invite-button")
        channelInvite.addEventListener("click", function() {
            showChannelInvite(channelId)
        });

    })

    window.__ACTIVE_CHANNEL_ID__ = channelId;
    window.location.hash = '#message'
}

document.getElementById('create_button')?.addEventListener('click', function () {
    const name = document.querySelector("#create-name")?.value;
    const isPrivate1 = document.querySelector("#create-private-true")?.checked
    const isPrivate2 = document.querySelector("#create-private-false")?.checked
    const description = document.querySelector("#create-description")?.value;
  const isPrivate = isPrivate1 ? true : false
  if (!name) {
    alert('please input name')
    return
  }
    createChannel({name,description,private:isPrivate})
    fetchChannelList()
});

export function showChannelEdit(channelId){
    const editDialog=document.getElementById("channel-edit")
    editDialog.style.display='block'
    window.__ACTIVE_MESSAGE_ID__=channelId
}

export function showChannelInvite(channelId){
    const editDialog=document.getElementById("channel-invite")
    editDialog.style.display='block'
    window.__ACTIVE_MESSAGE_ID__=channelId
    request(`/user`, {}, { method:'get'}).then((res) => {
        for(let i=0;i<res.users.length;i++){
            request(`/user/${res.users[i].id}`,{},{method:'get'}).then((data) => {
                const container=document.getElementById("users")
                const allUser=document.createElement('option')
                allUser.setAttribute('value',res.users[i].id)
                allUser.textContent=data.name
                container.appendChild(allUser)
                const options = Array.from(container.querySelectorAll("option"));
                const indexToInsert = options.findIndex(option => allUser.textContent.localeCompare(option.textContent) < 0);
                if (indexToInsert !== -1) {
                    container.insertBefore(allUser, options[indexToInsert]);
                } else {
                    container.appendChild(allUser);
                }
            })
        }
    })
}


