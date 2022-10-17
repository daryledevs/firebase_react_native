import React, { useEffect} from "react";
import PushNotification from "react-native-push-notification";
import message from '@react-native-firebase/messaging';

const NotificationController = () => {
  useEffect(() => {
    console.log('NotificationController');
    const unsubscribe = message().onMessage(async (remoteMessage) => {
      PushNotification.localNotification({
        message: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
        bigPictureUrl: remoteMessage.notification.android.imageUrl,
        smallIcon: remoteMessage.notification.android.imageUrl,
        channelId: true,
        vibrate: true
      });
    })
    return unsubscribe;
  }, []);
  
  return null;
};
 
export default NotificationController;