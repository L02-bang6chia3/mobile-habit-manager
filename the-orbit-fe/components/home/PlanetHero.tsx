// components/home/PlanetHero.tsx

import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { colors } from '../../constants/theme';

export function PlanetHero() {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <View style={styles.glowBack} />
      <View style={styles.glowFront} />

      <Image
        source={require('../../assets/images/orbit-planet.png')}
        style={[
          styles.image,
          {
            width: width * 1.08,
            height: width * 0.9,
          },
        ]}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 230,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: -18,
    marginBottom: 80,
    overflow: 'hidden',
  },

  glowBack: {
    position: 'absolute',
    bottom: 18,
    width: 330,
    height: 150,
    borderRadius: 180,
    backgroundColor: 'rgba(47,139,255,0.12)',
  },

  glowFront: {
    position: 'absolute',
    bottom: 0,
    width: 260,
    height: 90,
    borderRadius: 160,
    backgroundColor: 'rgba(0,216,255,0.08)',
  },

  image: {
    marginBottom: -24,
    opacity: 0.82,
  },
});
