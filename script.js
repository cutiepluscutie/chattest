const firebaseConfig = {
    apiKey: "AIzaSyBtdvFbGG_yusur8XlknmUwkxIMFThISog",
    authDomain: "livechat-9f999.firebaseapp.com",
    projectId: "livechat-9f999",
    storageBucket: "livechat-9f999.appspot.com",
    messagingSenderId: "952843776688",
    appId: "1:952843776688:web:935b8197c5c036b5278175"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Generate a random user ID
const userId = Math.random().toString(36).substring(2, 15);

// Listen for new messages
const messagesRef = database.ref('messages');
messagesRef.on('child_added', (snapshot) => {
    const message = snapshot.val();
    displayMessage(message);
});

// Display a message in the chat
function displayMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${message.userId}: ${message.text}`;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Send a new message
document.getElementById('message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('message-input');
    const text = input.value.trim();
    if (text) {
        messagesRef.push({
            userId: userId,
            text: text
        });
        input.value = '';
    }
});