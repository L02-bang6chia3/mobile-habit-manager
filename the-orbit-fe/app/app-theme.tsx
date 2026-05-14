import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';

const ORBIT_PLANET = require('../assets/images/orbit-planet.png');

export default function AppThemeScreen() {
  const [lightMode, setLightMode] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#11151F', '#0D1018', '#080A12']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFillObject}
      />

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
        <Text style={styles.title}>
          <Text style={styles.titleBlue}>App </Text>
          <Text style={styles.titlePink}>Theme</Text>
        </Text>

        <Text style={styles.sectionLabel}>BACKGROUND PREVIEW</Text>

        <LinearGradient
          colors={['rgba(11,24,32,0.98)', 'rgba(15,21,29,0.96)']}
          style={styles.previewCard}
        >
          <Image source={ORBIT_PLANET} resizeMode="contain" style={styles.previewPlanet} />
        </LinearGradient>

        <Text style={styles.sectionLabel}>CUSTOM BACKGROUND</Text>
        <Text style={styles.sectionDescription}>Upload your own celestial backdrop</Text>

        <Pressable style={({ pressed }) => [styles.uploadBox, pressed && styles.pressed]}>
          <View style={styles.uploadIcon}>
            <Ionicons name="document-attach-outline" size={28} color={colors.primary} />
          </View>
          <Text style={styles.uploadTitle}>Select Image</Text>
          <Text style={styles.uploadText}>PNG, JPG or WebP (max 5MB)</Text>
        </Pressable>

        <Text style={styles.sectionLabel}>APPEARANCE</Text>

        <Pressable
          onPress={() => setLightMode((value) => !value)}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <LinearGradient colors={['#1A1E28', '#151922']} style={styles.modeCard}>
            <View style={styles.modeCopy}>
              <Text style={styles.modeTitle}>Light Mode</Text>
              <Text style={styles.modeSubtitle}>Toggle light and dark modes</Text>
            </View>

            <View style={[styles.switchTrack, lightMode ? styles.switchTrackOn : styles.switchTrackOff]}>
              <View style={styles.switchThumb} />
            </View>
          </LinearGradient>
        </Pressable>

        <Text style={styles.footerNote}>CHANGES REFLECT INSTANTLY ACROSS YOUR ORBIT</Text>
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
    paddingTop: 30,
    paddingBottom: 40,
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
    marginTop: 40,
    color: colors.text,
    fontSize: 16,
    letterSpacing: 0,
  },
  sectionDescription: {
    marginTop: 6,
    color: 'rgba(244,247,255,0.75)',
    fontSize: 12,
  },
  previewCard: {
    marginTop: 20,
    height: 190,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  previewPlanet: {
    width: 320,
    height: 210,
  },
  uploadBox: {
    marginTop: 20,
    height: 188,
    borderRadius: 28,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(244,247,255,0.16)',
    backgroundColor: 'rgba(24,28,38,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(47,139,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  uploadTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  uploadText: {
    marginTop: 6,
    color: 'rgba(244,247,255,0.58)',
    fontSize: 12,
  },
  modeCard: {
    marginTop: 20,
    minHeight: 98,
    borderRadius: 30,
    paddingHorizontal: 26,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  modeCopy: {
    flex: 1,
  },
  modeTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  modeSubtitle: {
    marginTop: 8,
    color: 'rgba(244,247,255,0.62)',
    fontSize: 14,
  },
  switchTrack: {
    width: 54,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  switchTrackOn: {
    alignItems: 'flex-end',
    backgroundColor: '#0CC692',
  },
  switchTrackOff: {
    alignItems: 'flex-start',
    backgroundColor: '#202838',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#B9C2D2',
  },
  footerNote: {
    marginTop: 88,
    color: 'rgba(244,247,255,0.62)',
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 4,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.86,
  },
});
