import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/theme';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#060812', '#0B101C', '#050711']} style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.logo}>
            OR<Text style={styles.logoLight}>BIT</Text>
          </Text>

          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in and continue your orbit.</Text>

          <View style={styles.form}>
            <TextInput
              placeholder="Email"
              placeholderTextColor={colors.dim}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor={colors.dim}
              style={styles.input}
              secureTextEntry
            />

            <Pressable style={styles.button} onPress={() => router.replace('/(tabs)')}>
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>

            <Pressable onPress={() => router.push('/(auth)/onboarding')}>
              <Text style={styles.link}>View onboarding</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  logo: {
    color: colors.primary,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 36,
  },
  logoLight: {
    color: '#DDE6FF',
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 10,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  form: {
    marginTop: 36,
  },
  input: {
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.bgCard,
    color: colors.text,
    paddingHorizontal: 18,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  button: {
    height: 58,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  link: {
    marginTop: 22,
    color: colors.muted,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
  },
});
