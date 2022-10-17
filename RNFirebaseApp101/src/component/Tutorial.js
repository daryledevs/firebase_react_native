
import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '325769001267-i1sk9glba6bmfkjfm2pcei123appuq4r.apps.googleusercontent.com',
});

const Tutorial = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  function signOut(){
    auth()
    .signOut()
    .then(() => console.log('User signed out!'));
  }

  function signInAnonymous(){
    auth()
    .signInAnonymously()
    .then(() => {
      console.log('User signed in anonymously');
    })
    .catch(error => {
      if (error.code === 'auth/operation-not-allowed') {
        console.log('Enable anonymous in your firebase console.');
      }

      console.error(error);
    });
  }
  
  function signInNativeEmail(){
    auth()
    .createUserWithEmailAndPassword('jane.doe@example.com', 'SuperSecretPassword!')
    .then(() => {
      console.log('User account created & signed in!');
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }
      
      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }

      console.error(error);
    });
  }

  async function onGoogleButtonPress() {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    console.log(googleCredential)
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  return (
    <View>
      <View>
        <Text>Welcome {user === null ? 'no user' : 'uid'}</Text>
        <Button title="Sign in anonymous" onPress={signInAnonymous}/>
        <Button title="sign in native" onPress={signInNativeEmail}/>
        <Button
          title="Google Sign-In"
          onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
        />
        <Button title="Sign out" onPress={signOut}/>
      </View>
    </View>
  )
}

export default Tutorial