import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrbitHeader } from '../../components/home/OrbitHeader';
import { colors } from '../../constants/theme';

const recurrenceOptions = ['One time', 'Daily', 'Weekly', 'Custom'];


function SignalSetup() {
    return (
        <View style={styles.signalCard}>
            <View style={styles.signalTitleRow}>
                <View style={styles.signalIcon}>
                    <Ionicons name="notifications-outline" size={24} color="#F0A0F4" />
                </View>
                <Text style={styles.signalTitle}>Signal Setup</Text>
            </View>

            <View style={styles.delayRow}>
                <Text style={styles.delayLabel}>T-MINUS DELAY</Text>
                <Text style={styles.delayValue}>
                    15<Text style={styles.delayUnit}>MIN</Text>
                </Text>
            </View>

            <View style={styles.sliderTrack}>
                <View style={styles.sliderThumb} />
            </View>

            <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>0M</Text>
                <Text style={styles.sliderLabel}>30M</Text>
                <Text style={styles.sliderLabel}>60M</Text>
            </View>

            <View style={styles.frequencyRow}>
                <View>
                    <Text style={styles.frequencyTitle}>Primary Frequency</Text>
                    <Text style={styles.frequencySubtitle}>Daily Reminder Window</Text>
                </View>

                <View style={styles.timeRow}>
                    <Text style={styles.timeText}>06:15</Text>
                    <Ionicons name="chevron-down" size={18} color="rgba(244,241,250,0.75)" />
                </View>
            </View>

            <View style={styles.feedbackRow}>
                <View style={styles.feedbackLeft}>
                    <Ionicons name="phone-portrait-outline" size={23} color="#00F5BE" />
                    <Text style={styles.feedbackText}>Haptic Feedback</Text>
                </View>

                <View style={styles.toggle}>
                    <View style={styles.toggleDot} />
                </View>
            </View>
        </View>
    );
}

export default function AddTaskScreen() {
    return (
        <SafeAreaView style={styles.safe}>
            <LinearGradient colors={['#060812', '#0B101C', '#050711']} style={styles.container}>
                <OrbitHeader />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                    <Text style={styles.title}>
                        <Text style={styles.titleBlue}>Add</Text> Task
                    </Text>
                    <Text style={styles.subtitle}>Enter detail information about the task you want to create.</Text>

                    <Text style={styles.inputLabelPink}>DAILY TASKS NAME</Text>
                    <TextInput placeholder="e.g. Daily 1" placeholderTextColor="rgba(244,241,250,0.34)" style={styles.input} />

                    <Text style={styles.inputLabelPink}>DESCRIPTION</Text>
                    <TextInput placeholder="Describe the daily task" placeholderTextColor="rgba(244,241,250,0.34)" style={styles.input} />

                    <Text style={styles.inputLabelPink}>DURATION (M)</Text>
                    <TextInput placeholder="e.g. 10 minutes" placeholderTextColor="rgba(244,241,250,0.34)" style={styles.input} />

                    <Text style={styles.recurrenceLabel}>RECURRENCE LOGIC</Text>
                    <View style={styles.segmented}>
                        {recurrenceOptions.map((option) => (
                            <Pressable key={option} style={[styles.segmentItem, option === 'One time' && styles.segmentActive]}>
                                <Text style={[styles.segmentText, option === 'One time' && styles.segmentTextActive]}>{option}</Text>
                            </Pressable>
                        ))}
                    </View>

                    <View style={styles.dateSelect}>
                        <Ionicons name="calendar-outline" size={23} color="#66A8FF" />
                        <Text style={styles.dateText}>OCT 24, 2026</Text>
                        <Ionicons name="chevron-down" size={18} color="rgba(244,241,250,0.75)" />
                    </View>

                    <View style={styles.calendarCard}>
                        <View style={styles.calendarHeader}>
                            <Text style={styles.calendarYear}>2026</Text>
                            <View style={styles.monthRow}>
                                <Ionicons name="chevron-back" size={18} color="rgba(244,241,250,0.75)" />
                                <Text style={styles.monthText}>MARCH</Text>
                                <Ionicons name="chevron-forward" size={18} color="rgba(244,241,250,0.75)" />
                            </View>
                        </View>

                        <View style={styles.weekRow}>
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                                <Text key={day} style={styles.weekText}>{day}</Text>
                            ))}
                        </View>

                        <View style={styles.daysGrid}>
                            {['28', '29', '30', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'].map((day) => (
                                <View key={day} style={[styles.calendarDay, day === '1' && styles.blueDay, day === '6' && styles.blueDay, day === '9' && styles.pinkDay]}>
                                    <Text style={[styles.dayText, ['28', '29', '30'].includes(day) && styles.mutedDay, day === '7' && styles.todayText]}>{day}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <SignalSetup />

                    <Pressable style={styles.ctaWrap}>
                        <LinearGradient colors={['#2F8BFF', '#89B9FF', '#EF94F4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cta}>
                            <Text style={styles.ctaText}>CREATE TASK</Text>
                        </LinearGradient>
                    </Pressable>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    container: { flex: 1 },
    content: {
        paddingHorizontal: 35,
        paddingTop: 26,
        paddingBottom: 56,
    },
    title: {
        color: '#C992F0',
        fontSize: 36,
        fontWeight: '900',
    },
    titleBlue: { color: '#2F8BFF' },
    subtitle: {
        marginTop: 14,
        maxWidth: 330,
        color: '#F4F1FA',
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 30,
    },
    inputLabel: {
        marginTop: 30,
        color: '#D8E6FF',
        fontSize: 15,
        fontWeight: '900',
        letterSpacing: 5,
    },
    inputLabelPink: {
        marginTop: 30,
        color: '#F7C4F9',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 2,
    },
    input: {
        marginTop: 12,
        minHeight: 49,
        borderRadius: 28,
        backgroundColor: '#252933',
        paddingHorizontal: 22,
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    textArea: {
        minHeight: 112,
        borderRadius: 28,
        paddingTop: 20,
        textAlignVertical: 'top',
    },
    sectionTitle: {
        marginTop: 30,
        color: '#7FB2FF',
        fontSize: 25,
        fontWeight: '900',
    },
    sectionTitlePink: { color: '#D99AF3' },
    emptyAddButton: {
        marginTop: 28,
        height: 70,
        borderRadius: 18,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#D99AF3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyAddText: {
        color: '#A895FF',
        fontSize: 13,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    recurrenceLabel: {
        marginTop: 54,
        color: 'rgba(244,241,250,0.38)',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    segmented: {
        marginTop: 14,
        height: 41,
        borderRadius: 22,
        backgroundColor: '#050507',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
    },
    segmentItem: {
        flex: 1,
        height: 33,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    segmentActive: { backgroundColor: '#63A8FF' },
    segmentText: {
        color: 'rgba(244,241,250,0.42)',
        fontSize: 11,
        fontWeight: '700',
    },
    segmentTextActive: {
        color: '#07101C',
        fontWeight: '900',
    },
    dateSelect: {
        marginTop: 14,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#C992F0',
        paddingHorizontal: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateText: {
        color: '#F4F1FA',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 1,
    },
    calendarCard: {
        marginTop: 14,
        borderRadius: 32,
        backgroundColor: 'rgba(20,21,31,0.82)',
        padding: 25,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    calendarYear: {
        color: '#F4F1FA',
        fontSize: 20,
        fontWeight: '900',
    },
    monthRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    monthText: {
        color: '#F4F1FA',
        fontSize: 13,
        fontWeight: '800',
    },
    weekRow: {
        marginTop: 38,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    weekText: {
        width: 30,
        textAlign: 'center',
        color: 'rgba(244,241,250,0.52)',
        fontSize: 10,
    },
    daysGrid: {
        marginTop: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: 22,
    },
    calendarDay: {
        width: `${100 / 7}%`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayText: {
        width: 31,
        height: 31,
        borderRadius: 16,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#F4F1FA',
        fontSize: 14,
    },
    mutedDay: { color: 'rgba(244,241,250,0.16)' },
    todayText: { color: '#23CFFF', fontWeight: '900' },
    blueDay: {
        borderRadius: 16,
    },
    pinkDay: {
        borderRadius: 16,
        backgroundColor: 'rgba(239,148,244,0.42)',
        shadowColor: '#EF94F4',
        shadowOpacity: 0.9,
        shadowRadius: 9,
    },
    signalCard: {
        marginTop: 28,
        borderRadius: 31,
        backgroundColor: 'rgba(27,26,38,0.95)',
        padding: 32,
    },
    signalTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    signalIcon: {
        width: 43,
        height: 43,
        borderRadius: 22,
        backgroundColor: 'rgba(240,160,244,0.22)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    signalTitle: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '800',
    },
    delayRow: {
        marginTop: 34,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    delayLabel: {
        color: 'rgba(244,241,250,0.58)',
        fontSize: 16,
        letterSpacing: 5,
    },
    delayValue: {
        color: '#FFFFFF',
        fontSize: 35,
        fontWeight: '900',
    },
    delayUnit: {
        color: '#F7C4F9',
        fontSize: 14,
    },
    sliderTrack: {
        marginTop: 28,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(244,241,250,0.12)',
    },
    sliderThumb: {
        position: 'absolute',
        left: 63,
        top: -10,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#74B4FF',
        shadowColor: '#74B4FF',
        shadowOpacity: 1,
        shadowRadius: 14,
    },
    sliderLabels: {
        marginTop: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sliderLabel: {
        color: 'rgba(244,241,250,0.34)',
        fontSize: 11,
    },
    frequencyRow: {
        marginTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    frequencyTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
    frequencySubtitle: {
        marginTop: 3,
        color: 'rgba(244,241,250,0.48)',
        fontSize: 12,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    timeText: {
        color: '#2F8BFF',
        fontSize: 24,
        fontWeight: '900',
    },
    feedbackRow: {
        marginTop: 26,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(17,18,27,0.42)',
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    feedbackLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 13,
    },
    feedbackText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 1,
    },
    toggle: {
        width: 48,
        height: 26,
        borderRadius: 13,
        backgroundColor: 'rgba(0,245,190,0.28)',
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
    toggleDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.65)',
    },
    ctaWrap: {
        marginTop: 48,
        shadowColor: '#2F8BFF',
        shadowOpacity: 0.8,
        shadowRadius: 22,
        shadowOffset: { width: 0, height: 8 },
        elevation: 10,
    },
    cta: {
        height: 58,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaText: {
        color: '#111827',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 3,
    },
});
