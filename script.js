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
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// Elements
var messagesDiv = document.getElementById('messages');
var messageInput = document.getElementById('message-input');
var sendButton = document.getElementById('send-button');

// Get user's IP and generate a unique ID (not recommended for production)
var userId;
fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        userId = data.ip.replace(/\./g, '-'); // Replace dots to avoid issues in Firebase keys
    });

// Load chat messages
database.ref('messages').on('child_added', function(snapshot) {
    var message = snapshot.val();
    var messageDiv = document.createElement('div');
    messageDiv.textContent = message.user + ': ' + message.text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Send a new message
sendButton.addEventListener('click', function() {
    var messageText = messageInput.value.trim();
    if (messageText !== '') {
        var newMessageRef = database.ref('messages').push();
        newMessageRef.set({
            user: userId,
            text: messageText
        }).then(function() {
            console.log('Message sent successfully');
            messageInput.value = '';
        }).catch(function(error) {
            console.error('Error sending message:', error);
        });
    }
});

// Send message on Enter key press
messageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});
