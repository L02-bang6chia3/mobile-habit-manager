import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/theme';

const ORBIT_PLANET = require('../../assets/images/orbit-planet.png');

const stats = [
  { label: 'SYNC LEVEL', value: '98.4%' },
  { label: 'HABITS', value: '7' },
  { label: 'RANK', value: 'ELITE' },
];

const settingRows = [
  {
    title: 'Update Profile',
    subtitle: 'Modify your celestial identity and data',
    icon: 'person-add-outline' as const,
    color: colors.primary,
    route: '/update-profile' as const,
  },
  {
    title: 'Change Password',
    subtitle: 'Biometric locks and encryption protocols',
    icon: 'shield-checkmark-outline' as const,
    color: colors.pink,
    route: '/reset-password' as const,
  },
  {
    title: 'App Theme',
    subtitle: 'Shift between nebula states and light modes',
    icon: 'color-palette-outline' as const,
    color: '#D9E6FF',
    route: '/app-theme' as const,
  },
];

function TopBar() {
  return (
    <View style={styles.topBar}>
      <Pressable hitSlop={10} style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={27} color={colors.primary} />
      </Pressable>

      <Pressable style={styles.plusButton} onPress={() => router.push('/premium')}>
        <Ionicons name="diamond" size={13} color="#061111" />
        <Text style={styles.plusText}>PLUS</Text>
      </Pressable>
    </View>
  );
}

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#11151F', '#0D1018', '#070910']}
        locations={[0, 0.45, 1]}
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

      <TopBar />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profile}>
          <LinearGradient
            colors={[colors.pink, '#988DFF', colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarRing}
          >
            <View style={styles.avatarInner}>
              <Ionicons name="person" size={64} color="#1E2633" />
            </View>
          </LinearGradient>
          <View style={styles.avatarDot} />

          <Text style={styles.name}>Minh Thu</Text>

          <View style={styles.profileTags}>
            <Text style={styles.ageTag}>28 TERRAN YEARS</Text>
            <Text style={styles.genderTag}>BIOLOGICAL: FEMALE</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {stats.map((item) => (
            <LinearGradient key={item.label} colors={['#171B25', '#111720']} style={styles.statBox}>
              <Text style={styles.statLabel}>{item.label}</Text>
              <Text style={[styles.statValue, item.label === 'HABITS' && styles.statPink]}>
                {item.value}
              </Text>
            </LinearGradient>
          ))}
        </View>

        <View style={styles.rows}>
          {settingRows.map((item) => (
            <Pressable
              key={item.title}
              disabled={!item.route}
              onPress={() => item.route && router.push(item.route)}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <LinearGradient
                colors={['rgba(18,24,31,0.92)', 'rgba(8,13,18,0.88)']}
                style={styles.settingCard}
              >
                <View style={[styles.settingIcon, { backgroundColor: `${item.color}22` }]}>
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>

                <View style={styles.settingTextWrap}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                </View>

                <Ionicons name="chevron-forward" size={24} color="rgba(244,247,255,0.32)" />
              </LinearGradient>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={() => router.push('/premium')} style={({ pressed }) => pressed && styles.pressed}>
          <LinearGradient colors={['#1A2531', '#101720']} style={styles.premiumCard}>
            <View style={styles.premiumCopy}>
              <Text style={styles.premiumTitle}>Go to Premium</Text>
              <Text style={styles.premiumText}>
                Direct synchronization with the orbital mainframe. Experimental biometric feedback
                required.
              </Text>
            </View>

            <View style={styles.enableButton}>
              <Text style={styles.enableText}>ENABLE</Text>
            </View>
          </LinearGradient>
        </Pressable>
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
    bottom: 64,
    alignItems: 'center',
  },
  backgroundPlanet: {
    width: 420,
    height: 430,
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
    paddingHorizontal: 34,
    paddingTop: 58,
    paddingBottom: 132,
  },
  profile: {
    alignItems: 'center',
  },
  avatarRing: {
    width: 152,
    height: 152,
    borderRadius: 76,
    padding: 6,
    shadowColor: colors.primary,
    shadowOpacity: 0.55,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 9,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 70,
    backgroundColor: '#F7F8FA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#131722',
  },
  avatarDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    borderWidth: 4,
    borderColor: '#273244',
    marginTop: -36,
    marginLeft: 102,
  },
  name: {
    marginTop: 26,
    color: colors.text,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
  },
  profileTags: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 12,
  },
  ageTag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(246,165,255,0.25)',
    color: '#F1B9FF',
    fontSize: 12,
    letterSpacing: 1,
  },
  genderTag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(47,139,255,0.18)',
    color: colors.primary,
    fontSize: 12,
    letterSpacing: 1,
  },
  statsRow: {
    marginTop: 42,
    flexDirection: 'row',
    gap: 14,
  },
  statBox: {
    flex: 1,
    minHeight: 78,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  statLabel: {
    color: 'rgba(244,247,255,0.62)',
    fontSize: 9,
    marginBottom: 7,
  },
  statValue: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '900',
  },
  statPink: {
    color: colors.pink,
  },
  rows: {
    marginTop: 38,
    gap: 20,
  },
  settingCard: {
    minHeight: 112,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(47,139,255,0.5)',
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  settingTextWrap: {
    flex: 1,
    paddingRight: 14,
  },
  settingTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  settingSubtitle: {
    marginTop: 4,
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
  },
  premiumCard: {
    marginTop: 34,
    minHeight: 160,
    borderRadius: 30,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  premiumCopy: {
    flex: 1,
    paddingRight: 4,
  },
  premiumTitle: {
    color: '#00FFB2',
    fontSize: 20,
    fontWeight: '900',
  },
  premiumText: {
    marginTop: 16,
    color: 'rgba(244,247,255,0.62)',
    fontSize: 13,
    lineHeight: 20,
  },
  enableButton: {
    height: 36,
    paddingHorizontal: 22,
    borderRadius: 18,
    backgroundColor: '#00FFB2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enableText: {
    color: '#041313',
    fontSize: 11,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.86,
  },
});
