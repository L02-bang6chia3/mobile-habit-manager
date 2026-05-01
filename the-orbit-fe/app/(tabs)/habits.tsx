import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrbitHeader } from '../../components/home/OrbitHeader';
import { colors } from '../../constants/theme';

export default function HabitsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#060812', '#0B101C', '#050711']} style={styles.container}>
        <OrbitHeader />

        <View style={styles.content}>
          <Text style={styles.label}>HABIT SYSTEM</Text>
          <Text style={styles.title}>Habits</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your orbit is empty</Text>
            <Text style={styles.cardText}>
              Add habits and organize them into your daily rhythm.
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
  card: {
    marginTop: 38,
    borderRadius: 26,
    backgroundColor: colors.bgCard,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  cardText: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
});
