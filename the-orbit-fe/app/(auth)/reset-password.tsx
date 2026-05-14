import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AuthInput, AuthScreen, GradientButton, GradientTitle } from '../../components/auth/AuthUI';

export default function ResetPasswordScreen() {
  return (
    <AuthScreen contentStyle={styles.screen}>
      <View style={styles.titleWrap}>
        <GradientTitle size={40} lineHeight={50}>
          Reset password
        </GradientTitle>
      </View>

      <Text style={styles.description}>{"Please type something you'll remember"}</Text>

      <View style={styles.form}>
        <AuthInput label="Current password" placeholder="Must be 8 characters" password />

        <AuthInput label="New password" placeholder="Must be 8 characters" password />

        <AuthInput label="Confirm new password" placeholder="Must be 8 characters" password />

        <View style={styles.buttonWrap}>
          <GradientButton title="Reset password" onPress={() => router.push('/otp')} />
        </View>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 58,
  },
  titleWrap: {
    alignItems: 'flex-start',
    marginBottom: 50,
  },
  description: {
    color: 'rgba(244,247,255,0.62)',
    fontSize: 17,
    marginBottom: 50,
  },
  form: {
    flex: 1,
  },
  buttonWrap: {
    marginTop: 10,
  },
});
