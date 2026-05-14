import { router } from 'expo-router';
import { useState } from 'react';
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
import { login } from '../../lib/authApi';

function getLoginErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to log in. Please try again.';
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (loading) {
      return;
    }

    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login({ email: normalizedEmail, password });
      router.replace('/(tabs)');
    } catch (loginError) {
      setError(getLoginErrorMessage(loginError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreen contentStyle={styles.screen}>
      <View style={styles.titleWrap}>
        <GradientTitle>Log in</GradientTitle>
      </View>

      <View style={styles.form}>
        <AuthInput
          label="Email"
          placeholder="Your email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />

        <AuthInput
          label="Password"
          placeholder="Password"
          password
          value={password}
          onChangeText={setPassword}
          editable={!loading}
          onSubmitEditing={handleLogin}
          returnKeyType="done"
        />

        <Pressable onPress={() => router.push('/forgot-password')}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.loginButtonWrap}>
          <AuthButton
            title={loading ? 'Logging in...' : 'Log in'}
            onPress={handleLogin}
            disabled={loading}
          />
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
  errorText: {
    marginTop: 18,
    color: colors.pink,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
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
