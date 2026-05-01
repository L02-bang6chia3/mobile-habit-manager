import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/theme';

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#060812', '#0B101C', '#050711']} style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.logo}>
            OR<Text style={styles.logoLight}>BIT</Text>
          </Text>

          <View style={styles.planetBox}>
            <Image
              source={require('../../assets/images/orbit-planet.png')}
              style={styles.planet}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>You are the center</Text>
          <Text style={styles.subtitle}>Let your habits orbit around your daily rhythm.</Text>

          <Pressable style={styles.button} onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>
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
    paddingTop: 28,
    paddingBottom: 36,
  },
  logo: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
  },
  logoLight: {
    color: '#DDE6FF',
  },
  planetBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planet: {
    width: 340,
    height: 340,
    opacity: 0.95,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    height: 58,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
