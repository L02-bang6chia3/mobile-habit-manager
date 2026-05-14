import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';

const ORBIT_PLANET = require('../assets/images/orbit-planet.png');

function ProfileField({
  label,
  icon,
  value,
  chevron,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  chevron?: boolean;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <LinearGradient colors={['rgba(22,34,45,0.96)', 'rgba(12,18,24,0.92)']} style={styles.fieldBox}>
        <Ionicons name={icon} size={23} color={colors.primary} />
        <TextInput
          value={value}
          editable={false}
          style={styles.fieldInput}
          placeholderTextColor="rgba(244,247,255,0.45)"
        />
        {chevron ? <Ionicons name="chevron-down" size={21} color="rgba(244,247,255,0.7)" /> : null}
      </LinearGradient>
    </View>
  );
}

export default function UpdateProfileScreen() {
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
        <Pressable hitSlop={10} onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={27} color={colors.primary} />
        </Pressable>

        <Pressable style={styles.plusButton} onPress={() => router.push('/premium')}>
          <Ionicons name="diamond" size={13} color="#061111" />
          <Text style={styles.plusText}>PLUS</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profile}>
          <LinearGradient
            colors={[colors.pink, '#988DFF', colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarRing}
          >
            <View style={styles.avatarInner}>
              <Ionicons name="person" size={72} color="#1E2633" />
            </View>
          </LinearGradient>

          <View style={styles.editDot}>
            <Ionicons name="pencil" size={18} color="#FFFFFF" />
          </View>

          <Text style={styles.name}>Minh Thu</Text>
        </View>

        <View style={styles.form}>
          <ProfileField label="USERNAME" icon="at-outline" value="Minh Thu" />
          <ProfileField label="AGE" icon="calendar-outline" value="21" />
          <ProfileField label="GENDER" icon="people-outline" value="Non-binary" chevron />
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
    bottom: 90,
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
    paddingBottom: 54,
  },
  profile: {
    alignItems: 'center',
  },
  avatarRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    padding: 6,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 74,
    backgroundColor: '#F7F8FA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#131722',
  },
  editDot: {
    width: 33,
    height: 33,
    borderRadius: 17,
    backgroundColor: '#34243E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -38,
    marginLeft: 112,
  },
  name: {
    marginTop: 34,
    color: colors.text,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
  },
  form: {
    marginTop: 70,
  },
  fieldGroup: {
    marginBottom: 24,
  },
  fieldLabel: {
    marginLeft: 15,
    marginBottom: 10,
    color: colors.text,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 3,
  },
  fieldBox: {
    height: 76,
    borderRadius: 28,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(47,139,255,0.7)',
    shadowColor: colors.primary,
    shadowOpacity: 0.7,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  fieldInput: {
    flex: 1,
    marginLeft: 18,
    color: colors.text,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
});
