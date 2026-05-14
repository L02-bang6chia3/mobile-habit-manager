import { StyleSheet, View } from 'react-native';
import { HabitCard } from './HabitCard';

export type HabitItem = {
  id: string;
  title: string;
  time: string;
  completed?: boolean;
};

type Props = {
  habits: HabitItem[];
};

export function HabitList({ habits }: Props) {
  return (
    <View style={styles.container}>
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          title={habit.title}
          time={habit.time}
          completed={habit.completed}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    marginTop: 38,
  },
});
