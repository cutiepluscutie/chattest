// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBtdvFbGG_yusur8XlknmUwkxIMFThISog",
    authDomain: "livechat-9f999.firebaseapp.com",
    projectId: "livechat-9f999",
    storageBucket: "livechat-9f999.appspot.com",
    messagingSenderId: "952843776688",
    appId: "1:952843776688:web:935b8197c5c036b5278175",
    databaseURL: "https://livechat-9f999-default-rtdb.firebaseio.com/" // Add this line
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const messaging = firebase.messaging();

let userId;

// Function to get user's IP address and generate a unique ID
async function getUserId() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const ip = data.ip;
        userId = btoa(ip).substring(0, 8); // Encode IP and take first 8 characters
    } catch (error) {
        console.error('Error getting IP:', error);
        userId = 'Anonymous-' + Math.random().toString(36).substr(2, 5);
    }
    return userId;
}

// Function to add a message to the database
function addMessage(message) {
    return database.ref('messages').push({
        userId: userId,
        text: message,
        timestamp: firebase.database.ServerValue.TIMESTAMP
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
    database.ref('messages').orderByChild('timestamp').on('child_added', (snapshot) => {
        displayMessage(snapshot.val());
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

// Request notification permission
async function requestNotificationPermission() {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const token = await messaging.getToken();
            console.log('FCM Token:', token);
            // You can send this token to your server to enable push notifications
        }
    } catch (error) {
        console.error('Error requesting notification permission:', error);
    }
}

// Initialize the chat
async function initChat() {
    await getUserId();
    listenForMessages();
    requestNotificationPermission();
}

initChat();

// Service Worker registration for FCM
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
}
