import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AuthInput,
  AuthLinkRow,
  AuthScreen,
  CheckRow,
  GradientButton,
  GradientTitle,
} from '../../components/auth/AuthUI';
import { colors } from '../../constants/theme';

export default function SignupScreen() {
  const [accepted, setAccepted] = useState(false);

  return (
    <AuthScreen contentStyle={styles.screen}>
      <View style={styles.titleWrap}>
        <GradientTitle>Sign up</GradientTitle>
      </View>

      <View style={styles.form}>
        <AuthInput label="Username" placeholder="Your username" autoCapitalize="none" />

        <AuthInput
          label="Email"
          placeholder="Your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AuthInput label="Password" placeholder="Must be 8 characters" password />

        <View style={styles.checkWrap}>
          <CheckRow
            checked={accepted}
            onPress={() => setAccepted((value) => !value)}
            text="I accept the terms and privacy policy"
          />
        </View>

        <View style={styles.buttonWrap}>
          <GradientButton title="Create Account" onPress={() => router.push('/otp')} />
        </View>

        <View style={styles.loginRow}>
          <AuthLinkRow
            text="Already have an account?"
            linkText="Log in"
            onPress={() => router.push('/login')}
          />
        </View>

        <View style={styles.footerTextWrap}>
          <Text style={styles.footerText}>By creating an account or signing you agree to our</Text>

          <Pressable>
            <Text style={styles.footerLink}>Terms and Conditions</Text>
          </Pressable>
        </View>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 42,
  },
  titleWrap: {
    alignItems: 'center',
    marginBottom: 35,
  },
  form: {
    flex: 1,
  },
  checkWrap: {
    marginTop: 2,
  },
  buttonWrap: {
    marginTop: 50,
  },
  loginRow: {
    marginTop: 60,
  },
  footerTextWrap: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingTop: 42,
  },
  footerText: {
    color: 'rgba(244,247,255,0.62)',
    fontSize: 14,
    textAlign: 'center',
  },
  footerLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
});
