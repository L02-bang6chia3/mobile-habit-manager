import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AuthButton,
  AuthDivider,
  AuthInput,
  AuthScreen,
  GoogleButton,
  GradientTitle,
} from '../../components/auth/AuthUI';
import { colors } from '../../constants/theme';

export default function LoginScreen() {
  return (
    <AuthScreen contentStyle={styles.screen}>
      <View style={styles.titleWrap}>
        <GradientTitle>Log in</GradientTitle>
      </View>

      <View style={styles.form}>
        <AuthInput label="Username" placeholder="Your username" autoCapitalize="none" />

        <AuthInput label="Password" placeholder="Password" password />

        <Pressable onPress={() => router.push('/forgot-password')}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>

        <View style={styles.loginButtonWrap}>
          <AuthButton title="Log in" onPress={() => router.replace('/(tabs)')} />
        </View>

        <AuthDivider />

        <GoogleButton onPress={() => {}} />

        <View style={styles.signupRow}>
          <Text style={styles.normalText}>{"Don't have an account?"}</Text>

          <Pressable onPress={() => router.push('/signup')}>
            <Text style={styles.linkText}> Sign up</Text>
          </Pressable>
        </View>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 52,
  },
  titleWrap: {
    alignItems: 'center',
    marginBottom: 54,
  },
  form: {
    flex: 1,
  },
  forgotText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
  },
  loginButtonWrap: {
    marginTop: 36,
  },
  signupRow: {
    marginTop: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  normalText: {
    color: 'rgba(244,247,255,0.62)',
    fontSize: 14,
    fontWeight: '500',
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
});
