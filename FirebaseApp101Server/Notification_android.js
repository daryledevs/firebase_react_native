var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Remote Push Notification
async function sendAlarmNotification(token) {
  return admin.messaging().send({
    token,
    notification: {
      body: "Hi here's your alarm",
      title: "It's time to wake up",
    },
    data: {
      type: "alarmNotification",
    },
  });
}

// Partial Push Notification
async function sendPartialNotification(token) {
  return admin.messaging().send({
    token,
    data: {
      type: "partial_notification",
      notifee: JSON.stringify({
        body: "I'm your push notification",
        android: {
          channelId: "default",
        },
      }),
    },
  });
}


module.exports = {
  alarmNotification: sendAlarmNotification,
  partialNotification: sendPartialNotification,
};