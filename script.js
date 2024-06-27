// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBtdvFbGG_yusur8XlknmUwkxIMFThISog",
    authDomain: "livechat-9f999.firebaseapp.com",
    projectId: "livechat-9f999",
    storageBucket: "livechat-9f999.appspot.com",
    messagingSenderId: "952843776688",
    appId: "1:952843776688:web:935b8197c5c036b5278175"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let userId;

// Function to get user's IP address and generate a unique ID
async function getUserId() {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    const ip = data.ip;
    userId = btoa(ip).substring(0, 8); // Encode IP and take first 8 characters
    return userId;
}

// Function to add a message to Firestore
function addMessage(message) {
    return db.collection('messages').add({
        userId: userId,
        text: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
}

// Function to display a message
function displayMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `
        <span class="user-id">${message.userId}:</span>
        <span class="message-text">${message.text}</span>
    `;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Listen for new messages
function listenForMessages() {
    db.collection('messages')
        .orderBy('timestamp')
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    displayMessage(change.doc.data());
                }
            });
        });
}

// Handle form submission
document.getElementById('message-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    if (message) {
        await addMessage(message);
        messageInput.value = '';
    }
});

// Initialize the chat
async function initChat() {
    await getUserId();
    listenForMessages();
}

initChat();
