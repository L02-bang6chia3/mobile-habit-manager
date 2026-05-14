import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';

const ORBIT_PLANET = require('../assets/images/orbit-planet.png');

const features = [
  {
    title: 'Advanced AI Gravity Sync',
    body: 'Harmonize your schedule with predictive orbital mechanics powered by next-gen neural processing.',
    icon: 'checkbox-outline' as const,
    color: colors.primary,
  },
  {
    title: 'Deep Orbit Analytics',
    body: 'Visualize your data through hyper-dimensional clusters and real-time trajectory projections.',
    icon: 'analytics-outline' as const,
    color: colors.pink,
  },
  {
    title: 'Unlimited Habit Constellations',
    body: 'Create infinite patterns of growth. No limits on the number of systems you can track across the void.',
    icon: 'copy-outline' as const,
    color: '#8AA9FF',
  },
  {
    title: 'Priority Signal Resonance',
    body: 'First-tier access to upcoming satellite features and instantaneous cloud synchronization response.',
    icon: 'radio-button-on-outline' as const,
    color: '#8AA9FF',
  },
];

function FeatureCard({
  title,
  body,
  icon,
  color,
}: {
  title: string;
  body: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}) {
  return (
    <LinearGradient colors={['rgba(24,28,38,0.95)', 'rgba(12,15,22,0.95)']} style={styles.featureCard}>
      <View style={[styles.featureIcon, { backgroundColor: `${color}22` }]}>
        <Ionicons name={icon} size={25} color={color} />
      </View>

      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureBody}>{body}</Text>
      </View>
    </LinearGradient>
  );
}

export default function PremiumScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#11151F', '#070910', '#000000']}
        locations={[0, 0.36, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      <View pointerEvents="none" style={styles.planetLayer}>
        <Image
          source={ORBIT_PLANET}
          resizeMode="cover"
          blurRadius={1}
          style={styles.backgroundPlanet}
        />
      </View>

      <View style={styles.topBar}>
        <Pressable hitSlop={10} onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={27} color={colors.primary} />
        </Pressable>

        <Text style={styles.logo}>ORBIT</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          <Text style={styles.titleBlue}>Orbit </Text>
          <Text style={styles.titlePink}>Plus</Text>
        </Text>

        <Text style={styles.subtitle}>
          Ascend beyond the standard limits and synchronize with the cosmic rhythm.
        </Text>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>PREMIUM FEATURE</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.features}>
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.optionDivider} />
          <Text style={styles.optionDividerText}>OPTIONS</Text>
          <View style={styles.optionDivider} />
        </View>

        <LinearGradient colors={['rgba(24,28,38,0.94)', 'rgba(13,16,24,0.94)']} style={styles.planCard}>
          <Text style={styles.planEyebrow}>STANDARD ENTRY</Text>
          <Text style={styles.planName}>Monthly Orbit</Text>
          <Text style={styles.planPrice}>
            $9.99<Text style={styles.planUnit}> /mo</Text>
          </Text>
          <View style={styles.planProgress}>
            <View style={styles.planProgressFill} />
          </View>
        </LinearGradient>

        <LinearGradient colors={['rgba(18,22,31,0.97)', 'rgba(8,11,18,0.97)']} style={styles.recommendedCard}>
          <Text style={styles.savings}>33% SAVINGS</Text>
          <Text style={styles.recommendedEyebrow}>RECOMMENDED PATH</Text>
          <Text style={styles.recommendedName}>Annual Trajectory</Text>
          <Text style={styles.recommendedPrice}>
            $79.99<Text style={styles.planUnit}> /yr</Text>
          </Text>
          <Text style={styles.recommendedText}>Equivalent to $6.66 per month.</Text>
          <LinearGradient
            colors={[colors.primary, '#75D7FF', '#00FFB2']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.recommendedProgress}
          />
        </LinearGradient>

        <Pressable style={({ pressed }) => [styles.upgradeButton, pressed && styles.pressed]}>
          <LinearGradient
            colors={[colors.primary, '#8EA0FF', colors.pink]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.upgradeGradient}
          >
            <Text style={styles.upgradeText}>UPGRADE</Text>
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
    bottom: 78,
    alignItems: 'center',
  },
  backgroundPlanet: {
    width: 620,
    height: 620,
    opacity: 0.44,
  },
  topBar: {
    height: 64,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(5,7,17,0.88)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(47,139,255,0.08)',
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logo: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '900',
  },
  scrollContent: {
    paddingHorizontal: 35,
    paddingTop: 34,
    paddingBottom: 46,
  },
  title: {
    textAlign: 'center',
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
  subtitle: {
    marginTop: 20,
    color: 'rgba(244,247,255,0.72)',
    fontSize: 20,
    lineHeight: 30,
  },
  dividerRow: {
    marginTop: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(244,247,255,0.46)',
  },
  dividerText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  features: {
    marginTop: 34,
    gap: 20,
  },
  featureCard: {
    minHeight: 204,
    borderRadius: 30,
    padding: 32,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 22,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    color: colors.text,
    fontSize: 21,
    lineHeight: 30,
    fontWeight: '900',
  },
  featureBody: {
    marginTop: 20,
    color: 'rgba(244,247,255,0.62)',
    fontSize: 15,
    lineHeight: 24,
  },
  optionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,255,178,0.45)',
  },
  optionDividerText: {
    color: '#00FFB2',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  planCard: {
    marginTop: 34,
    borderRadius: 28,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  planEyebrow: {
    color: 'rgba(244,247,255,0.62)',
    fontSize: 12,
    letterSpacing: 1.8,
  },
  planName: {
    marginTop: 10,
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  planPrice: {
    marginTop: 24,
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '900',
  },
  planUnit: {
    color: 'rgba(244,247,255,0.55)',
    fontSize: 14,
    fontWeight: '500',
  },
  planProgress: {
    marginTop: 30,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(244,247,255,0.08)',
  },
  planProgressFill: {
    width: '25%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#8AB5FF',
  },
  recommendedCard: {
    marginTop: 28,
    borderRadius: 28,
    padding: 32,
    borderWidth: 2,
    borderColor: '#68A7FF',
  },
  savings: {
    position: 'absolute',
    right: 24,
    top: -13,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#00FFB2',
    color: '#041313',
    fontSize: 10,
    fontWeight: '900',
  },
  recommendedEyebrow: {
    color: '#00FFB2',
    fontSize: 12,
    letterSpacing: 2,
  },
  recommendedName: {
    marginTop: 12,
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
  },
  recommendedPrice: {
    marginTop: 22,
    color: '#FFFFFF',
    fontSize: 46,
    fontWeight: '900',
  },
  recommendedText: {
    marginTop: 24,
    color: 'rgba(244,247,255,0.64)',
    fontSize: 14,
  },
  recommendedProgress: {
    marginTop: 28,
    height: 5,
    borderRadius: 3,
  },
  upgradeButton: {
    marginTop: 58,
    height: 65,
    borderRadius: 33,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOpacity: 0.7,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  upgradeGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  pressed: {
    opacity: 0.86,
  },
});
