import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrbitHeader } from '../../components/home/OrbitHeader';
import { colors } from '../../constants/theme';

const settings = [
  {
    id: '1',
    title: 'Profile',
    icon: 'person-outline' as const,
  },
  {
    id: '2',
    title: 'Notifications',
    icon: 'notifications-outline' as const,
  },
  {
    id: '3',
    title: 'Theme',
    icon: 'color-palette-outline' as const,
  },
];

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#060812', '#0B101C', '#050711']} style={styles.container}>
        <OrbitHeader />

        <View style={styles.content}>
          <Text style={styles.label}>SYSTEM CONFIG</Text>
          <Text style={styles.title}>Settings</Text>

          <View style={styles.list}>
            {settings.map((item) => (
              <View key={item.id} style={styles.row}>
                <View style={styles.rowIcon}>
                  <Ionicons name={item.icon} size={20} color={colors.primary} />
                </View>

                <Text style={styles.rowText}>{item.title}</Text>

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
  row: {
    minHeight: 66,
    borderRadius: 22,
    backgroundColor: colors.bgCard,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(47,139,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowText: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
});
