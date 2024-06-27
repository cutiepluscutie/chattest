// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onChildAdded, push } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDQPrgffVDwvUYxFxuG7_jX4v6qXUruXhM",
  authDomain: "chattest-4adb4.firebaseapp.com",
  databaseURL: "https://chattest-4adb4-default-rtdb.firebaseio.com",
  projectId: "chattest-4adb4",
  storageBucket: "chattest-4adb4.appspot.com",
  messagingSenderId: "760808958711",
  appId: "1:760808958711:web:9c4e7c9ef8744f05dec1f2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Get user IP
async function getUserIP() {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
}

// Get elements
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Load messages
onChildAdded(ref(db, 'messages'), (snapshot) => {
    const message = snapshot.val();
    const messageElement = document.createElement('div');
    messageElement.textContent = `[${message.id}] ${message.text}`;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Send message
sendButton.addEventListener('click', async () => {
    const message = messageInput.value;
    if (message.trim() === "") return;

    const userIP = await getUserIP();
    const messageData = {
        id: userIP,
        text: message
    };

    await push(ref(db, 'messages'), messageData);
    messageInput.value = "";
});
