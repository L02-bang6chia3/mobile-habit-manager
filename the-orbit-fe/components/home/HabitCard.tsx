import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../../constants/theme';

type Props = {
  title: string;
  time: string;
  completed?: boolean;
  onPress?: () => void;
};

export function HabitCard({ title, time, completed = false, onPress }: Props) {
  const glowColor = completed ? colors.pink : colors.primary;

  return (
    <LinearGradient
      colors={
        completed
          ? ['rgba(246,165,255,0.95)', 'rgba(246,165,255,0.18)']
          : ['rgba(47,139,255,0.95)', 'rgba(47,139,255,0.18)']
      }
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[
        styles.outer,
        {
          shadowColor: glowColor,
        },
      ]}
    >
      <Pressable onPress={onPress} style={styles.inner}>
        <View
          style={[
            styles.checkCircle,
            {
              borderColor: glowColor,
            },
          ]}
        >
          {completed && <Ionicons name="checkmark" size={13} color={colors.pink} />}
        </View>

        <View style={styles.textBox}>
          <Text numberOfLines={1} style={[styles.title, completed && styles.completedTitle]}>
            {title}
          </Text>

          <Text style={styles.time}>Completed at {time}</Text>
        </View>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: radius.xl,
    padding: 2,
    marginBottom: 20,
    shadowOpacity: 0.52,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 9,
  },
  inner: {
    minHeight: 78,
    borderRadius: radius.xl - 2,
    backgroundColor: colors.bgCard,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textBox: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  completedTitle: {
    color: 'rgba(255,255,255,0.55)',
    textDecorationLine: 'line-through',
  },
  time: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '500',
  },
});
