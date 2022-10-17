import { StyleSheet, Text, View, Button, Image, Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import React, { useEffect, useState } from 'react';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import api from '../api/api';
import axios from 'axios';

const LocalNotification = () => {
  PushNotification.localNotification({
    autoCancel: true,
    bigText:
      'This is local notification demo in React Native app. Only shown, when expanded.',
    subText: 'Local Notification Demo',
    title: 'Local Notification Title',
    message: 'Expand me to see more',
    channelId: 'channel101',
    vibrate: true,
    vibration: 300,
    playSound: true,
    soundName: 'default',
    // actions: '["Yes", "No"]',
  });
};

const Home = ({ route }) => {
  const { userInfo } = route.params;
  const navigation = useNavigation();
  const [img, setImg] = useState();
  const [token, setToken] = useState('');
  console.log('userInfo: ', userInfo?.additionalUserInfo);
  const handleSetTheAlarm = async () => {
    try {
      // console.log(token);
      const response = await axios.post('http://10.0.2.2:3001/alarm', {
        token,
      });
      console.log(response);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    function generateToken() {
      messaging()
        .getToken()
        .then(device_token => {
          console.log('Device token: ', device_token);
          setToken(device_token);
        });
    }
    generateToken();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      PushNotification.localNotification({
        channelId: 'channel101',
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
      });
    });

    return unsubscribe;
  }, []);

  function scheduleNotificationHandler() {
    console.log(new Date(new Date().getTime() + 3000));
    PushNotification.localNotificationSchedule({
      title: 'Test Schedule',
      date: new Date(new Date().getTime() + 3000),
      message: 'My Schedule notification Message',
      allowWhileIdle: false,
      channelId: 'channel101',
    });
  }

  function choosePic() {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: false,
    })
      .then(async image => {
        try {
          setImg(image);
          const imageName = image.path.substring(
            image.path.lastIndexOf('/') + 1,
          );
          const bucketFile = `image/${imageName}`;
          const pathToFile = image.path;
          await storage().ref(imageName).putFile(pathToFile);
          const url = await storage().ref(bucketFile).getDownloadURL();
          console.log('image url', url);
        } catch (error) {
          console.log(error);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  function signOut() {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
    navigation.navigate('Login');
  }
  
  return (
    <View>
      {/* <NotificationController /> */}
      <Text>{userInfo?.additionalUserInfo.given_name} {userInfo?.additionalUserInfo.family_name}</Text>
      <Image source={{uri: img?.path}} style={{width: 100, height: 100}} />
      <Button title="Add photo" onPress={choosePic} />
      <Button title="Notification" onPress={() => LocalNotification()} />
      <Button title="Schedule button" onPress={scheduleNotificationHandler} />
      <Button title="Alarm notification" onPress={handleSetTheAlarm} />
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
};

export default Home

const styles = StyleSheet.create({})