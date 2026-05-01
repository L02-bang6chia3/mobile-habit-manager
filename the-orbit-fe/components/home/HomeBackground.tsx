import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/theme';

type Props = {
  children: ReactNode;
};

export function HomeBackground({ children }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#060812', '#0B101C', '#050711']} style={styles.container}>
        <View style={styles.topGlow} />
        <View style={styles.bottomGlow} />
        {children}
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
    position: 'relative',
    overflow: 'hidden',
  },
  topGlow: {
    position: 'absolute',
    top: 70,
    left: -90,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(47,139,255,0.08)',
  },
  bottomGlow: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    width: 360,
    height: 220,
    borderRadius: 180,
    backgroundColor: 'rgba(0,216,255,0.08)',
  },
});
