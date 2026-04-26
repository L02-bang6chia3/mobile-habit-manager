import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';

export default function HomeScreen() {
  const [habits, setHabits] = useState([
    { id: '1', name: 'Đọc sách 30p', status: 'Chưa xong' },
    { id: '2', name: 'Chạy bộ 2km', status: 'Chưa xong' },
  ]);

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => 
      h.id === id ? { ...h, status: h.status === 'Xong' ? 'Chưa xong' : 'Xong' } : h
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>The Orbit - Habit Tracker</Text>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.habitItem} 
            onPress={() => toggleHabit(item.id)}
            testID={`habit-item-${item.id}`}
          >
            <Text>{item.name} - <Text style={{fontWeight: 'bold'}}>{item.status}</Text></Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  habitItem: { padding: 15, backgroundColor: '#f9f9f9', marginBottom: 10, borderRadius: 8 },
});