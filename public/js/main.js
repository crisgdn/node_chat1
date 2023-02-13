// imports will always go at the top
import ChatMsg from './components/ChatMessage.js';
import Login from './components/Login.js';
import Chat from './components/Chat.js';

const socket = io();

//utility functions for socket
function setUserID ({ sID }) {

    //save our unique ID generated by Socket on the server side - this is how we track individual connections to the chat service
    vm.socketID = sID;

}

function showNewMessage( { message }) {
    //debugger;
    vm.messages.push(message);
}


function handleUserTyping(user) {
  console.log('somebody is typing something');
}


  const { createApp } = Vue

  const vm = createApp({
    data() {
      return {
        socketID: '',
        message: '',
        messages: [],
        nickname: ''
    
      }
    }, 

    methods: {
        dispatchMessage() {
            socket.emit('chat_message', {
                content: this.message,
                name: this.nickname || 'anonymous',
                id: this.socketID
            })

            this.message = "";
        },

        catchTextFocus() {
          // emit a custom typing event and broadcast it to the server
          socket.emit('user_typing', {
            name: this.nickname || 'anonymous'
          })
        }
    },

    components: {
        newmsg: ChatMsg,
        login: Login,
        chat: Chat
    }

  }).mount('#app')
  

socket.addEventListener('connected', setUserID);
socket.addEventListener('new_message', showNewMessage);
socket.addEventListener('typing', handleUserTyping);
