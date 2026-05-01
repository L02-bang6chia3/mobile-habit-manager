import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

type Props = {
  onPress: () => void;
};

export function FloatingAddButton({ onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      <LinearGradient colors={[colors.primary, colors.purple, colors.pink]} style={styles.button}>
        <Ionicons name="add" size={34} color="#FFFFFF" />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: 24,
    bottom: 96,
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: colors.purple,
    shadowOpacity: 0.75,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 14,
  },
  button: {
    flex: 1,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
