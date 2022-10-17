import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Loading from './LoadingScreen';
import LoadingScreen from './LoadingScreen';

GoogleSignin.configure({
  webClientId:
    '325769001267-i1sk9glba6bmfkjfm2pcei123appuq4r.apps.googleusercontent.com',
});

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [userInfo, setUserInfo] = useState()
  const [loadingTrigger, setLoadingTrigger] = useState(false);
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if(user){
        setLoadingTrigger(!loadingTrigger);
        navigation.navigate('Home', {userInfo: userInfo});
        setEmail('');
        setPassword('');
      }
    })

    return unsubscribe;
  }, [])

  function loginHandler(){
    if (email === undefined || password === null) return;
    setLoadingTrigger(!loadingTrigger);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        let user = userCredentials.user;
        console.log(`Login successfully! Hello, ${user}!` );
      })
      .catch((error) => {
        console.log(error);
      })
  }

  async function onGoogleButtonPress() {
    GoogleSignin.signIn()
    .then(data => {
      const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
      auth()
        .signInWithCredential(googleCredential)
        .then(info => {
          console.log('User signed in using google!', info);
          setUserInfo(info);
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      console.log(error)
    })
  }

  return (
    <View style={styles.container} behavior="padding">
      <LoadingScreen isVisible={loadingTrigger} />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => {
            navigation.navigate('ForgotPassword');
          }}>
          <Text>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={loginHandler} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
          style={[styles.button, styles.buttonOutline]}>
          <Text style={styles.buttonOutlineText}>Signup</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
          style={styles.googleSignIn}
        >
          <Text>Google Sign-In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Login

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  inputContainer: {
    width: '80%',
  },

  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },

  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },

  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },

  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },

  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },

  forgotPassword: {
    margin: 4,
  },
  googleSignIn: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
});