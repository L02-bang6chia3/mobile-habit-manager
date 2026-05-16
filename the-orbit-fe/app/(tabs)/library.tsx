import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrbitHeader } from '../../components/home/OrbitHeader';
import { colors } from '../../constants/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const coreProtocols = [
  {
    id: '1',
    title: 'Deep Work Protocol',
    description: 'Neural synchronization for focused cognitive throughput. 3 Core Steps.',
    icon: 'headset-outline' as IconName,
    tag: 'HIGH STABILITY',
  },
  {
    id: '2',
    title: 'Morning Gravity Core',
    description: 'Ground your consciousness before daily launch. 5 Core Steps.',
    icon: 'sunny-outline' as IconName,
    tag: 'FUNDAMENTAL',
  },
];

const communityProtocols = [
  {
    id: '3',
    creator: 'Nova_09',
    stat: '1.2k',
    title: 'Zen Master Path',
    description: 'A minimalist flow for absolute mental clarity during high-stress windows.',
  },
  {
    id: '4',
    creator: 'Kaelen.V',
    stat: '842',
    title: 'Star Runner Journey',
    description: 'Cardiovascular endurance protocol mapped to circadian peaks.',
  },
];

export default function LibraryScreen() {
  return (
      <SafeAreaView style={styles.safe}>
        <LinearGradient colors={['#050711', '#0A1020', '#050711']} style={styles.container}>
          <OrbitHeader />

          <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
          >
            <Text style={styles.title}>
              <Text style={styles.titleBlue}>Habits</Text> Library
            </Text>
            <Text style={styles.subtitle}>Map your trajectory through the digital void.</Text>

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.blueLabel}>PROTOCOL ALPHA</Text>
                <Text style={styles.sectionTitle}>System Core</Text>
              </View>

              <Text style={styles.activeText}>3 Protocols Active</Text>
            </View>

            <View style={styles.list}>
              {coreProtocols.map((item) => (
                  <LinearGradient
                      key={item.id}
                      colors={['rgba(36,139,255,0.95)', 'rgba(14,16,29,0.96)', 'rgba(10,12,22,0.98)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.blueCardBorder}
                  >
                    <View style={styles.protocolCard}>
                      <View style={styles.protocolTop}>
                        <View style={styles.iconCircle}>
                          <Ionicons name={item.icon} size={22} color="#76AEFF" />
                        </View>

                        <View style={styles.tag}>
                          <Text style={styles.tagText}>{item.tag}</Text>
                        </View>
                      </View>

                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Text style={styles.cardDescription}>{item.description}</Text>

                      <View style={styles.actions}>
                        <Pressable style={styles.previewButton}>
                          <Text style={styles.previewText}>PREVIEW</Text>
                        </Pressable>

                        <Pressable style={styles.syncButton}>
                          <Text style={styles.syncText}>SYNC TO ORBIT</Text>
                        </Pressable>
                      </View>
                    </View>
                  </LinearGradient>
              ))}
            </View>

            <View style={styles.communityHeader}>
              <Text style={styles.pinkLabel}>SHARED VISIONS</Text>

              <View style={styles.communityTitleRow}>
                <Text style={styles.communityTitle}>Community{'\n'}Constellations</Text>
                <Text style={styles.trending}>Trending</Text>
              </View>
            </View>

            <View style={styles.list}>
              {communityProtocols.map((item) => (
                  <LinearGradient
                      key={item.id}
                      colors={['rgba(235,139,242,0.9)', 'rgba(16,15,25,0.96)', 'rgba(12,13,21,0.98)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.pinkCardBorder}
                  >
                    <View style={styles.protocolCard}>
                      <View style={styles.creatorRow}>
                        <View style={styles.avatar}>
                          <Ionicons name="sparkles" size={22} color="#FFD15C" />
                        </View>

                        <View style={styles.creatorInfo}>
                          <Text style={styles.creatorName}>{item.creator}</Text>
                          <Text style={styles.creatorRole}>SUN CREATOR</Text>
                        </View>

                        <View style={styles.statBox}>
                          <Text style={styles.stat}>{item.stat}</Text>
                          <Text style={styles.orbiting}>ORBITING</Text>
                        </View>
                      </View>

                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Text style={styles.cardDescription}>{item.description}</Text>

                      <View style={styles.actions}>
                        <Pressable style={styles.previewButton}>
                          <Text style={styles.previewText}>PREVIEW</Text>
                        </Pressable>

                        <Pressable style={styles.pinkSyncButton}>
                          <Text style={styles.pinkSyncText}>SYNC TO ORBIT</Text>
                        </Pressable>
                      </View>
                    </View>
                  </LinearGradient>
              ))}
            </View>
          </ScrollView>
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
    paddingTop: 26,
    paddingBottom: 140,
  },
  title: {
    color: '#B9A5FF',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0,
  },
  titleBlue: {
    color: '#2F8BFF',
  },
  subtitle: {
    marginTop: 6,
    maxWidth: 290,
    color: '#F1F2FA',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
  sectionHeader: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  blueLabel: {
    color: '#66A8FF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 4,
  },
  pinkLabel: {
    color: '#F0A0F4',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 4,
  },
  sectionTitle: {
    marginTop: 4,
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900',
  },
  activeText: {
    marginBottom: 2,
    color: '#6BA9FF',
    fontSize: 13,
    fontWeight: '900',
  },
  list: {
    marginTop: 26,
    gap: 22,
  },
  blueCardBorder: {
    borderRadius: 28,
    padding: 1.5,
    shadowColor: '#2F8BFF',
    shadowOpacity: 0.75,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  pinkCardBorder: {
    borderRadius: 28,
    padding: 1.5,
    shadowColor: '#F08AF7',
    shadowOpacity: 0.55,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  protocolCard: {
    borderRadius: 27,
    backgroundColor: 'rgba(12,13,23,0.97)',
    padding: 24,
  },
  protocolTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: 'rgba(79,128,211,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tag: {
    borderWidth: 1,
    borderColor: '#3CC5FF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagText: {
    color: '#74B6FF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  cardTitle: {
    marginTop: 22,
    color: '#F5F2FA',
    fontSize: 20,
    fontWeight: '900',
  },
  cardDescription: {
    marginTop: 10,
    color: '#F0EDF8',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24,
  },
  actions: {
    marginTop: 24,
    flexDirection: 'row',
    gap: 12,
  },
  previewButton: {
    height: 40,
    flex: 1,
    borderRadius: 22,
    backgroundColor: 'rgba(40,42,54,0.78)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewText: {
    color: '#F4F0F8',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  syncButton: {
    height: 40,
    flex: 1.38,
    borderRadius: 22,
    backgroundColor: '#74B4FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#74B4FF',
    shadowOpacity: 0.8,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
  syncText: {
    color: '#101725',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.8,
  },
  communityHeader: {
    marginTop: 36,
  },
  communityTitleRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  communityTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 31,
  },
  trending: {
    marginBottom: 4,
    color: '#F0A0F4',
    fontSize: 14,
    fontWeight: '900',
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: '#EE99F5',
    backgroundColor: 'rgba(255,174,66,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatorInfo: {
    flex: 1,
    marginLeft: 10,
  },
  creatorName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  creatorRole: {
    marginTop: 2,
    color: '#F0A0F4',
    fontSize: 8,
    fontWeight: '900',
  },
  statBox: {
    alignItems: 'flex-end',
  },
  stat: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  orbiting: {
    marginTop: 2,
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  pinkSyncButton: {
    height: 40,
    flex: 1.38,
    borderRadius: 22,
    backgroundColor: '#F09AF4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F09AF4',
    shadowOpacity: 0.7,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
  pinkSyncText: {
    color: '#27132C',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.8,
  },
});
