import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/theme';

type Props = {
  onPressProfile?: () => void;
  onPressPlus?: () => void;
};

export function OrbitHeader({ onPressProfile, onPressPlus }: Props) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onPressProfile} style={styles.logoRow}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={25} color="#738091" />
        </View>

        <Text style={styles.logo}>
          OR<Text style={styles.logoLight}>BIT</Text>
        </Text>
      </Pressable>

      <Pressable onPress={onPressPlus} style={styles.plusBadge}>
        <Ionicons name="diamond-outline" size={14} color="#001B12" />
        <Text style={styles.plusText}>PLUS</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 62,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D1D7DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logo: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -1,
  },
  logoLight: {
    color: '#DDE6FF',
  },
  plusBadge: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 14,
    backgroundColor: colors.mint,
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusText: {
    marginLeft: 5,
    color: '#001B12',
    fontSize: 11,
    fontWeight: '900',
  },
});
