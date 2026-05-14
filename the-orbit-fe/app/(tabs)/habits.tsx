import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/theme';

const ORBIT_PLANET = require('../../assets/images/orbit-planet.png');

const habits = [
  {
    id: 'zen',
    title: 'Zen Master Path',
    description: 'A minimalist flow for absolute mental clarity during high-stress windows.',
  },
  {
    id: 'runner',
    title: 'Star Runner Journey',
    description: 'Cardiovascular endurance protocol mapped to circadian peaks.',
  },
  {
    id: 'focus',
    title: 'Star Runner Journey',
    description: 'Cardiovascular endurance protocol mapped to circadian peaks.',
  },
];

export default function HabitsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#11151F', '#0D1018', '#070910']}
        locations={[0, 0.46, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      <View pointerEvents="none" style={styles.planetLayer}>
        <Image
          source={ORBIT_PLANET}
          resizeMode="contain"
          blurRadius={2}
          style={styles.backgroundPlanet}
        />
      </View>

      <View style={styles.topBar}>
        <Pressable hitSlop={10} style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={27} color={colors.primary} />
        </Pressable>

        <Pressable style={styles.plusButton} onPress={() => router.push('/premium')}>
          <Ionicons name="diamond" size={13} color="#061111" />
          <Text style={styles.plusText}>PLUS</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          <Text style={styles.titleBlue}>Your </Text>
          <Text style={styles.titlePink}>habits</Text>
        </Text>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Habits</Text>
          <Text style={styles.activeCount}>3 Active</Text>
        </View>

        <View style={styles.cards}>
          {habits.map((habit) => (
            <LinearGradient
              key={habit.id}
              colors={['rgba(21,25,36,0.88)', 'rgba(8,11,18,0.84)']}
              style={styles.habitCard}
            >
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{habit.title}</Text>
                <Text style={styles.cardDescription}>{habit.description}</Text>

                <View style={styles.cardActions}>
                  <Pressable style={styles.previewButton}>
                    <Text style={styles.previewText}>PREVIEW</Text>
                  </Pressable>

                  <Pressable style={styles.deleteButton}>
                    <Text style={styles.deleteText}>DELETE</Text>
                  </Pressable>
                </View>
              </View>
            </LinearGradient>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  planetLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 54,
    alignItems: 'center',
  },
  backgroundPlanet: {
    width: 420,
    height: 420,
    opacity: 0.42,
  },
  topBar: {
    height: 64,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(5,7,17,0.88)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(47,139,255,0.08)',
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusButton: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#00FFB2',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  plusText: {
    color: '#041313',
    fontSize: 12,
    fontWeight: '900',
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 28,
    paddingBottom: 132,
  },
  title: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '900',
  },
  titleBlue: {
    color: colors.primary,
  },
  titlePink: {
    color: colors.pink,
  },
  sectionHeader: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  activeCount: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  cards: {
    marginTop: 48,
    gap: 24,
  },
  habitCard: {
    minHeight: 210,
    borderRadius: 31,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 25,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOpacity: 0.72,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 9,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  cardDescription: {
    marginTop: 12,
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 25,
    maxWidth: 290,
  },
  cardActions: {
    marginTop: 24,
    flexDirection: 'row',
    gap: 12,
  },
  previewButton: {
    height: 42,
    minWidth: 164,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewText: {
    color: '#06131F',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  deleteButton: {
    height: 42,
    minWidth: 118,
    borderRadius: 22,
    backgroundColor: '#202027',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
