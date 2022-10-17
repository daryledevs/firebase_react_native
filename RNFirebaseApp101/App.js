import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import Login from './src/screens/Login';
import Home from './src/screens/Home';
import ForgotPassword from './src/screens/ForgotPassword';
import Signup from './src/screens/Signup';
import api from './src/api/api';
import axios from 'axios';
// https://rnfirebase.io/messaging/notifications
const Stack = createStackNavigator();

function generateToken(){
  messaging()
    .getToken()
    .then(device_token => {
      console.log('Device token: ', device_token);
    });
};

const App = () => {

  const createNotificationChannel = () => {
    console.log("Creating channel")
    PushNotification.createChannel({
      channelId: 'channel101',
      channelName: 'channel-test',
    });
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // http://10.0.2.2:3000
        // http://127.0.0.1:3001
        const response = await axios.get('http://10.0.2.2:3001/notifications');
        // action is just type and payload
        console.log('response: ', response);
      } catch (error) {
        console.log(`Client Error: ${error.message}`);
      }
    };
    fetchPosts();
    generateToken();
    createNotificationChannel();

    // handle push notification while the app is open
    const foregroundNotification = messaging().onMessage(
      async remoteMessage => {
        console.log(remoteMessage);
      },
    );

    // handle background push notification
    messaging().setBackgroundMessageHandler(async remoteMessage =>
      console.log('remoteMessage', remoteMessage),
    );

    return foregroundNotification;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App