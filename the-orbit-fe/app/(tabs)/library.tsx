import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrbitHeader } from '../../components/home/OrbitHeader';
import { colors } from '../../constants/theme';

const libraryItems = [
  {
    id: '1',
    title: 'Morning Routine',
    description: 'Start your day with calm and focus.',
    icon: 'sunny-outline' as const,
  },
  {
    id: '2',
    title: 'Deep Work',
    description: 'Build a focused work session habit.',
    icon: 'timer-outline' as const,
  },
  {
    id: '3',
    title: 'Mindfulness',
    description: 'Short meditation and breathing habits.',
    icon: 'leaf-outline' as const,
  },
];

export default function LibraryScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#060812', '#0B101C', '#050711']} style={styles.container}>
        <OrbitHeader />

        <View style={styles.content}>
          <Text style={styles.label}>ORBIT LIBRARY</Text>
          <Text style={styles.title}>Library</Text>

          <View style={styles.list}>
            {libraryItems.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.iconBox}>
                  <Ionicons name={item.icon} size={24} color={colors.primary} />
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription}>{item.description}</Text>
                </View>

                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </View>
            ))}
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
  list: {
    marginTop: 38,
  },
  card: {
    minHeight: 86,
    borderRadius: 26,
    backgroundColor: colors.bgCard,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(47,139,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  cardDescription: {
    marginTop: 5,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
});
