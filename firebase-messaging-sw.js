importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyBtdvFbGG_yusur8XlknmUwkxIMFThISog",
    authDomain: "livechat-9f999.firebaseapp.com",
    projectId: "livechat-9f999",
    storageBucket: "livechat-9f999.appspot.com",
    messagingSenderId: "952843776688",
    appId: "1:952843776688:web:935b8197c5c036b5278175"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);
    // Customize notification here
    const notificationTitle = 'New Message';
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon.png' // Add an icon file to your project
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
