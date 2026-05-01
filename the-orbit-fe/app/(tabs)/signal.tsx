import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrbitHeader } from '../../components/home/OrbitHeader';
import { colors } from '../../constants/theme';

export default function SignalScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#060812', '#0B101C', '#050711']} style={styles.container}>
        <OrbitHeader />

        <View style={styles.content}>
          <Text style={styles.label}>ORBIT SIGNAL</Text>
          <Text style={styles.title}>Signal</Text>

          <View style={styles.signalCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="sparkles" size={28} color="#FFFFFF" />
            </View>

            <Text style={styles.cardTitle}>Daily Signal</Text>
            <Text style={styles.cardText}>
              Your focus signal will appear here after you complete more habits.
            </Text>
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
    paddingHorizontal: 32,
    paddingTop: 28,
    paddingBottom: 120,
  },
  label: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 6,
  },
  title: {
    marginTop: 6,
    color: colors.primary,
    fontSize: 38,
    fontWeight: '900',
  },
  signalCard: {
    marginTop: 38,
    borderRadius: 28,
    backgroundColor: colors.bgCard,
    padding: 26,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  cardText: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
});
