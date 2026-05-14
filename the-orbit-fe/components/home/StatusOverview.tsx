import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/theme';

type Props = {
  label: string;
  title: string;
};

export function StatusOverview({ label, title }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingTop: 28,
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
    lineHeight: 44,
    fontWeight: '900',
  },
});
