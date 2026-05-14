import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HabitCard } from '@/components/home/HabitCard';
import { colors } from '@/constants/theme';
// import GradientText from "@/components/GradientText";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#050711', '#07111A', '#050711']} style={styles.container}>
        <Image
          source={require('../../assets/images/orbit-planet.png')}
          style={styles.bgImage}
          resizeMode="contain"
        />

        <LinearGradient
          colors={['rgba(5,7,17,0.25)', 'rgba(5,7,17,0.08)', 'rgba(5,7,17,0.75)', 'rgba(5,7,17,1)']}
          locations={[0, 0.35, 0.75, 1]}
          style={styles.bgOverlay}
          pointerEvents="none"
        />
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color="#6D7688" />
            </View>

            <Text style={styles.logo}>
              OR<Text style={styles.logoMuted}>BIT</Text>
            </Text>
          </View>

          <TouchableOpacity style={styles.plusBadge}>
            <Ionicons name="diamond-outline" size={14} color="#001B12" />
            <Text style={styles.plusText}>PLUS</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.eyebrow}>STATUS OVERVIEW</Text>
          <Text style={styles.title}>Today</Text>

          <View style={styles.cards}>
            <HabitCard title="Morning Meditation" time="07:15 AM" />
            <HabitCard title="Morning Meditation" time="07:15 AM" completed />
            <HabitCard title="Morning Meditation" time="07:15 AM" />
          </View>
        </View>

        <TouchableOpacity style={styles.floatingButton} onPress={() => router.push('/add-habit')}>
          <Ionicons name="add" size={34} color="white" />
        </TouchableOpacity>
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
    backgroundColor: '#131318',
    justifyContent: 'flex-end',
  },
  bgImage: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '60%',
    opacity: 0.88,
  },

  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    height: 64,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D2D7DD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -1,
  },
  logoMuted: {
    color: '#D8DFF0',
  },
  plusBadge: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 14,
    backgroundColor: colors.mint,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  plusText: {
    color: '#001B12',
    fontWeight: '800',
    fontSize: 11,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 34,
  },
  eyebrow: {
    color: colors.muted,
    letterSpacing: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    // color: colors.primary,
    fontSize: 38,
    fontWeight: '800',
    marginTop: 6,
  },
  cards: {
    marginTop: 40,
  },
  planetBox: {
    flex: 1,
    minHeight: 230,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: -18,
    marginBottom: 84,
    overflow: 'hidden',
  },
  planetGlow: {
    position: 'absolute',
    bottom: 12,
    width: 330,
    height: 150,
    borderRadius: 180,
    backgroundColor: 'rgba(47,139,255,0.12)',
  },
  planet: {
    width: 390,
    height: 320,
    marginBottom: -34,
    opacity: 0.82,
  },
  floatingButton: {
    position: 'absolute',
    right: 24,
    bottom: 96,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.purple,
    shadowOpacity: 0.8,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
});
