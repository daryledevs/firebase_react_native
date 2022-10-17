import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const ForgotPassword = () => {
  const navigation = useNavigation()
  const [email, setEmail] = useState('');

  function resetPassword() {
    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        console.log('Success password reset: ');
      })
      .catch(error => {
        console.log(`RP ${error.code}`);
      });
  }

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
      />

      <Button title="Send" onPress={resetPassword} />
    </View>
  );
}

export default ForgotPassword

const styles = StyleSheet.create({})