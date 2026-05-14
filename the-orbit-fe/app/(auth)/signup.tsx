import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
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
import { register } from '../../lib/authApi';

function getSignupErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to create account. Please try again.';
}

export default function SignupScreen() {
  const [accepted, setAccepted] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  async function handleSignup() {
    if (loading) {
      return;
    }

    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim();

    if (!normalizedUsername || !normalizedEmail || !password) {
      setError('Username, email, and password are required.');
      setSuccess(null);
      return;
    }

    if (!accepted) {
      setError('Please accept the terms and privacy policy.');
      setSuccess(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await register({
        username: normalizedUsername,
        email: normalizedEmail,
        password,
      });
      setSuccess('Account created. Backend does not support OTP yet, so you can log in now.');
      redirectTimer.current = setTimeout(() => router.replace('/login'), 1100);
    } catch (signupError) {
      setError(getSignupErrorMessage(signupError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreen contentStyle={styles.screen}>
      <View style={styles.titleWrap}>
        <GradientTitle>Sign up</GradientTitle>
      </View>

      <View style={styles.form}>
        <AuthInput
          label="Username"
          placeholder="Your username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
          editable={!loading}
        />

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
          placeholder="Must be 8 characters"
          password
          value={password}
          onChangeText={setPassword}
          editable={!loading}
          onSubmitEditing={handleSignup}
          returnKeyType="done"
        />

        <View style={styles.checkWrap}>
          <CheckRow
            checked={accepted}
            onPress={() => setAccepted((value) => !value)}
            text="I accept the terms and privacy policy"
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}

        <View style={styles.buttonWrap}>
          <GradientButton
            title={loading ? 'Creating...' : 'Create Account'}
            onPress={handleSignup}
            disabled={loading}
          />
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
  errorText: {
    marginTop: 18,
    color: colors.pink,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  successText: {
    marginTop: 18,
    color: colors.mint,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
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
