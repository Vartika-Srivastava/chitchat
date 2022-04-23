const form = document.getElementById('msgbox');
const msgInp = document.getElementById('msg');
const cArea = document.querySelector('.chatarea');
const rname = document.getElementById('room');
const usrs = document.getElementById('users');

// extracting username and room from url
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io();

socket.emit('joinRoom', {username, room});

socket.on('roomUsers', ({room,users}) => {
    opRoom(room);
    opUsers(users);
})

// message from server
socket.on('chatMsg', (message) => {
    appendMsg(message,'left');
});

socket.on('update', message => {
    appendMsg(message,'centre');
});

//  getting msg from frontend
form.addEventListener('submit', (e) => {
    e.preventDefault();

    let msg = msgInp.value;
    msg = msg.trim();

    if (!msg) {
        return false;
    }

    sendMsg(msg);

    msgInp.value = '';
    msgInp.focus();    
});

// formatting msg
function sendMsg(msg){
    const current = new Date();
    let msgObj = {
        uname: username,
        text: msg,
        time: current.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
    }
    console.log(msgObj);
    appendMsg(msgObj,'right');
    
    // send to server
    socket.emit('chatMsg', msgObj);

}

// add msg
function appendMsg(message, pos) {
    const div = document.createElement('div');
    if(pos == 'centre'){
        div.classList.add('centre');
        div.innerHTML = `<p class="text">${message}</p>`;
        
    }else{
        div.classList.add('message');
        div.classList.add(pos);
        div.innerHTML = `<p class="meta">${message.uname}<span> ${message.time}</span></p>
        <p class="text">${message.text}</p>`;
    }
    
    cArea.appendChild(div);
    cArea.scrollTop = cArea.scrollHeight;
}

// add rooms
function opRoom(room){
    rname.innerText = room;
}

// add users
function opUsers(users){
    usrs.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}