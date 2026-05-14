import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';

export default function AddHabitScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#060812', '#0B101C', '#050711']} style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>

          <Text style={styles.headerTitle}>New Habit</Text>

          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>CREATE ORBIT</Text>
          <Text style={styles.title}>Add Habit</Text>

          <View style={styles.form}>
            <Text style={styles.inputLabel}>Habit name</Text>
            <TextInput
              placeholder="Morning Meditation"
              placeholderTextColor={colors.dim}
              style={styles.input}
            />

            <Text style={styles.inputLabel}>Reminder time</Text>
            <TextInput
              placeholder="07:15 AM"
              placeholderTextColor={colors.dim}
              style={styles.input}
            />

            <Pressable style={styles.saveButton} onPress={() => router.back()}>
              <Text style={styles.saveText}>Create Habit</Text>
            </Pressable>
          </View>
        </View>
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
  },
  header: {
    height: 62,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  placeholder: {
    width: 42,
  },
  content: {
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
    fontWeight: '900',
  },
  form: {
    marginTop: 38,
  },
  inputLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  input: {
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.bgCard,
    color: colors.text,
    paddingHorizontal: 18,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  saveButton: {
    height: 58,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
