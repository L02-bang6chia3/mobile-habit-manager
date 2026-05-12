import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import {
  AuthInput,
  AuthLinkRow,
  AuthScreen,
  GradientButton,
  GradientTitle,
} from '../../components/auth/AuthUI';

export default function ForgotPasswordScreen() {
  return (
    <AuthScreen contentStyle={styles.screen}>
      <View style={styles.titleWrap}>
        <GradientTitle size={40} lineHeight={52}>
          Forgot{'\n'}Password
        </GradientTitle>
      </View>

      <Text style={styles.description}>
        Don’t worry! It happens. Please enter the email associated with your account.
      </Text>

      <View style={styles.form}>
        <AuthInput
          label="Email address"
          placeholder="Enter your email address"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.buttonWrap}>
          <GradientButton title="Send code" onPress={() => router.push('/reset-password')} />
        </View>
      </View>

      <View style={styles.bottomLink}>
        <AuthLinkRow
          text="Remember password?"
          linkText="Log in"
          onPress={() => router.push('/login')}
        />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 62,
  },
  titleWrap: {
    alignItems: 'center',
    marginBottom: 52,
  },
  description: {
    color: 'rgba(244,247,255,0.82)',
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 50,
  },
  form: {
    flex: 1,
  },
  buttonWrap: {
    marginTop: 24,
  },
  bottomLink: {
    marginTop: 'auto',
    paddingTop: 80,
  },
});
