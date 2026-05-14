import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/theme';

const ringtoneOptions = [
  {
    id: 'minimal',
    title: 'Minimal',
    description: 'Only critical gravity shifts',
    icon: 'grid-outline' as const,
    color: colors.primary,
  },
  {
    id: 'balanced',
    title: 'Balanced',
    description: 'Standard orbital reminders',
    icon: 'sunny-outline' as const,
    color: '#95AAFF',
    selected: true,
  },
  {
    id: 'intense',
    title: 'Intense',
    description: 'High-frequency cosmic feedback',
    icon: 'sparkles-outline' as const,
    color: colors.pink,
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

function ToggleRow({
  icon,
  title,
  enabled,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  enabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <LinearGradient colors={['#181C27', '#121720']} style={styles.toggleRow}>
        <View style={[styles.greenIcon, !enabled && styles.greenIconOff]}>
          <Ionicons name={icon} size={24} color={enabled ? '#041313' : 'rgba(244,247,255,0.54)'} />
        </View>

        <Text style={styles.toggleText}>{title}</Text>

        <View style={[styles.toggleTrack, enabled ? styles.toggleTrackOn : styles.toggleTrackOff]}>
          <View style={styles.toggleThumb} />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

export default function SignalScreen() {
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#11151F', '#0D1018', '#080A12']}
        locations={[0, 0.52, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <TopBar />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          <Text style={styles.titleBlue}>Notifi</Text>
          <Text style={styles.titlePink}>cation</Text>
        </Text>

        <Text style={styles.sectionLabel}>ALERTS</Text>
        <ToggleRow
          enabled={alertsEnabled}
          icon="notifications-outline"
          title="Receive alerts and updates"
          onPress={() => setAlertsEnabled((value) => !value)}
        />

        <Text style={styles.sectionLabel}>NOTIFICATION RINGTONE</Text>
        <View style={styles.optionList}>
          {ringtoneOptions.map((item) => (
            <LinearGradient
              key={item.id}
              colors={['#1A1E28', '#151922']}
              style={[styles.optionCard, item.selected && styles.optionCardSelected]}
            >
              <View style={[styles.optionIcon, { backgroundColor: `${item.color}22` }]}>
                <Ionicons name={item.icon} size={22} color={item.color} />
              </View>

              <View style={styles.optionTextWrap}>
                <Text style={styles.optionTitle}>{item.title}</Text>
                <Text style={styles.optionDescription}>{item.description}</Text>
              </View>
            </LinearGradient>
          ))}
        </View>

        <Text style={styles.sectionLabel}>HAPTIC FEEDBACK</Text>
        <ToggleRow
          enabled={hapticsEnabled}
          icon="phone-portrait-outline"
          title="Receive alerts and updates"
          onPress={() => setHapticsEnabled((value) => !value)}
        />

        <Text style={styles.sectionLabel}>QUIET HOURS</Text>
        <LinearGradient colors={['#1B1F2A', '#151922']} style={styles.quietCard}>
          <View style={styles.timeRow}>
            <View style={styles.timeCol}>
              <Text style={styles.timeLabel}>DARK SIDE ENTRY</Text>
              <Text style={styles.timeValue}>
                22:00<Text style={styles.timeSuffix}> PM</Text>
              </Text>
            </View>

            <View style={styles.timeDivider} />

            <View style={styles.timeCol}>
              <Text style={styles.timeLabel}>ORBIT SUNRISE</Text>
              <Text style={styles.timeValue}>
                07:30<Text style={styles.timeSuffix}> AM</Text>
              </Text>
            </View>
          </View>

          <View style={styles.slider}>
            <View style={styles.sliderRail} />
            <LinearGradient
              colors={[colors.primary, '#A79BFA']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.sliderActive}
            />
            <View style={[styles.sliderThumb, styles.sliderStart]} />
            <View style={[styles.sliderThumb, styles.sliderEnd]} />
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={15} color={colors.primary} />
            <Text style={styles.infoText}>
              Notifications will be silenced except for critical system failures during this window.
            </Text>
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
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
    paddingTop: 28,
    paddingBottom: 132,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '900',
  },
  titleBlue: {
    color: colors.primary,
  },
  titlePink: {
    color: colors.pink,
  },
  sectionLabel: {
    marginTop: 34,
    marginBottom: 14,
    color: colors.text,
    fontSize: 16,
    letterSpacing: 5,
  },
  toggleRow: {
    minHeight: 86,
    borderRadius: 30,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  greenIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00FFB2',
    marginRight: 18,
  },
  greenIconOff: {
    backgroundColor: '#202838',
  },
  toggleText: {
    flex: 1,
    color: 'rgba(244,247,255,0.72)',
    fontSize: 15,
  },
  toggleTrack: {
    width: 48,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleTrackOn: {
    alignItems: 'flex-end',
    backgroundColor: '#0CC692',
  },
  toggleTrackOff: {
    alignItems: 'flex-start',
    backgroundColor: '#202838',
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
  },
  optionList: {
    gap: 12,
  },
  optionCard: {
    minHeight: 88,
    borderRadius: 30,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  optionCardSelected: {
    borderColor: colors.primary,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  optionTextWrap: {
    flex: 1,
  },
  optionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  optionDescription: {
    marginTop: 5,
    color: 'rgba(244,247,255,0.58)',
    fontSize: 14,
  },
  quietCard: {
    borderRadius: 30,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeCol: {
    flex: 1,
  },
  timeLabel: {
    color: 'rgba(244,247,255,0.62)',
    fontSize: 12,
    letterSpacing: 1.5,
  },
  timeValue: {
    marginTop: 8,
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
  },
  timeSuffix: {
    color: 'rgba(244,247,255,0.65)',
    fontSize: 16,
    fontWeight: '800',
  },
  timeDivider: {
    width: 1,
    height: 48,
    marginHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  slider: {
    height: 48,
    marginTop: 26,
    justifyContent: 'center',
  },
  sliderRail: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(244,247,255,0.08)',
  },
  sliderActive: {
    position: 'absolute',
    left: '24%',
    right: '24%',
    height: 6,
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E8EEF8',
  },
  sliderStart: {
    left: '22%',
  },
  sliderEnd: {
    right: '22%',
  },
  infoBox: {
    marginTop: 18,
    borderRadius: 6,
    backgroundColor: 'rgba(8,11,18,0.7)',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoText: {
    flex: 1,
    color: 'rgba(244,247,255,0.62)',
    fontSize: 12,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.86,
  },
});
