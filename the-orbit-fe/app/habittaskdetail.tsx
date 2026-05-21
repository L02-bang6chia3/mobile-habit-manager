import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrbitHeader } from '../components/home/OrbitHeader';
import { colors } from '../constants/theme';

const days = Array.from({ length: 6 }).map((_, index) => ({
    day: index + 1,
    tasks: [
        { id: '1', title: 'Standard Alignment', duration: '15m', icon: 'accessibility-outline' as const, color: '#2F8BFF' },
        { id: '2', title: 'Knowledge Harvest', duration: '30m', icon: 'book-outline' as const, color: '#EF94F4' },
    ],
}));

export default function LibraryHabitTasksScreen() {
    return (
        <SafeAreaView style={styles.safe}>
            <LinearGradient colors={['#060812', '#0B101C', '#050711']} style={styles.container}>
                <OrbitHeader />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.content, styles.contentWithCta]}
                >
                    <Text style={styles.title}>
                        <Text style={styles.titleBlue}>Habits</Text> Name
                    </Text>

                    <Text style={styles.duration}>Over 2 months</Text>

                    <Text style={styles.description}>
                        A neuro-optimized trajectory designed to bypass atmospheric noise and enter a
                        state of high-yield cognitive resonance.
                    </Text>

                    <View style={styles.shortLine} />

                    <View style={styles.allTasksRow}>
                        <View style={styles.line} />
                        <Text style={styles.allTasksText}>ALL TASKS</Text>
                        <View style={styles.line} />
                    </View>

                    {days.map((day) => (
                        <View key={day.day} style={styles.dayBlock}>
                            <Text style={styles.dayTitle}>
                                Day <Text style={styles.dayNumber}>{day.day}</Text>
                            </Text>

                            <View style={styles.tasks}>
                                {day.tasks.map((task) => (
                                    <View key={`${day.day}-${task.id}`} style={styles.taskRow}>
                                        <View style={[styles.taskAccent, { backgroundColor: task.color }]} />
                                        <View style={[styles.taskIcon, { backgroundColor: `${task.color}22` }]}>
                                            <Ionicons name={task.icon} size={22} color={task.color} />
                                        </View>
                                        <Text style={styles.taskName}>{task.title}</Text>
                                        <View style={styles.durationBox}>
                                            <Text style={styles.taskDuration}>{task.duration}</Text>
                                            <Text style={styles.durationLabel}>DURATION</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.ctaArea}>
                    <Pressable>
                        <LinearGradient
                            colors={['#2F8BFF', '#89B9FF', '#EF94F4']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.cta}
                        >
                            <Ionicons name="sync" size={18} color="#111827" />
                            <Text style={styles.ctaText}>SYNC TO ORBIT</Text>
                        </LinearGradient>
                    </Pressable>
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
    content: {
        paddingHorizontal: 35,
        paddingTop: 26,
        paddingBottom: 80,
    },
    contentWithCta: {
        paddingBottom: 130,
    },
    heroRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 16,
    },
    heroText: {
        flex: 1,
    },
    title: {
        color: '#B9A5FF',
        fontSize: 36,
        fontWeight: '900',
    },
    titleBlue: {
        color: '#2F8BFF',
    },
    duration: {
        marginTop: 10,
        color: '#9EC4FF',
        fontSize: 18,
        fontWeight: '900',
    },
    editButton: {
        width: 41,
        height: 41,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#6FAEFF',
        backgroundColor: 'rgba(40,30,58,0.55)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#EF94F4',
        shadowOpacity: 0.5,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    description: {
        marginTop: 18,
        color: '#F4F1FA',
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 30,
    },
    shortLine: {
        marginTop: 12,
        width: 32,
        height: 1,
        backgroundColor: 'rgba(47,139,255,0.65)',
    },
    allTasksRow: {
        marginTop: 48,
        marginBottom: 46,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.24)',
    },
    allTasksText: {
        color: '#F4F1FA',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 2,
    },
    dayBlock: {
        marginBottom: 42,
    },
    dayTitle: {
        color: '#6AA8FF',
        fontSize: 27,
        fontWeight: '900',
    },
    dayNumber: {
        color: '#B49AFF',
    },
    tasks: {
        marginTop: 22,
        gap: 34,
    },
    taskRow: {
        minHeight: 54,
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskAccent: {
        width: 4,
        height: 45,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        marginRight: 16,
    },
    taskIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    taskName: {
        flex: 1,
        color: 'rgba(244,241,250,0.62)',
        fontSize: 12,
        fontWeight: '700',
    },
    durationBox: {
        alignItems: 'flex-end',
    },
    taskDuration: {
        color: '#F5F1FA',
        fontSize: 16,
        fontWeight: '900',
    },
    durationLabel: {
        marginTop: 2,
        color: 'rgba(244,241,250,0.18)',
        fontSize: 9,
        fontWeight: '800',
    },
    ctaArea: {
        position: 'absolute',
        left: 32,
        right: 32,
        bottom: 28,
        shadowColor: '#2F8BFF',
        shadowOpacity: 0.85,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 8 },
        elevation: 12,
    },
    cta: {
        height: 58,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    ctaText: {
        color: '#111827',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 3,
    },
});
