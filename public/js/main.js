const form = document.getElementById('msgbox');
const msgInp = document.getElementById('msg');
const cArea = document.querySelector('.chatarea');
const rname = document.getElementById('room');
const usrs = document.getElementById('users');

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

console.log(username,room);

const socket = io();

socket.emit('joinRoom', {username, room});

socket.on('roomUsers', ({room,users}) => {
    opRoom(room);
    opUsers(users);
})

// message from server
socket.on('message', message => {
    console.log(message)
    outputMsg(message,'left');
});

socket.on('update', message => {
    outputMsg(message,'centre');
    console.log(message)
});

// socket.on('receive', message => {
//     console.log(message)
//     outputMsg(message,'left');
// });

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let msg = msgInp.value;
    msg = msg.trim();

    if (!msg) {
        return false;
    }
    // outputMsg(msg,'right');
    // socket.emit('send', msg);
    // console.log(msg);

    socket.emit('chatMsg', msg);

    msgInp.value = '';
    msgInp.focus();
});

function outputMsg(message, pos) {
    const div = document.createElement('div');
    if(pos == 'centre'){
        div.classList.add('centre');
        div.innerHTML = `<p class="text">${message}</p>`;
        // console.log(message,pos)
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