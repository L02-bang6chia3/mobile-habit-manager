import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrbitHeader } from '../../components/home/OrbitHeader';
import { colors } from '../../constants/theme';

const mockTasks = Array.from({ length: 4 }).flatMap((_, index) => [
    {
        id: `alignment-${index}`,
        title: 'Standard Alignment',
        duration: '15m',
        icon: 'accessibility-outline' as const,
        color: '#2F8BFF',
    },
    {
        id: `harvest-${index}`,
        title: 'Knowledge Harvest',
        duration: '30m',
        icon: 'book-outline' as const,
        color: '#EF94F4',
    },
]);

export default function EditHabitScreen() {
    return (
        <SafeAreaView style={styles.safe}>
            <LinearGradient colors={['#060812', '#0B101C', '#050711']} style={styles.container}>
                <OrbitHeader />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentWithButton}>
                    <Text style={styles.title}>
                        <Text style={styles.titleBlue}>Edit</Text> habit
                    </Text>

                    <Text style={styles.subtitle}>Edit information about the habit roadmap.</Text>

                    <Text style={styles.inputLabel}>HABIT NAME</Text>
                    <TextInput
                        placeholder="e.g. Deep Neural Focus"
                        placeholderTextColor="rgba(244,241,250,0.34)"
                        style={styles.input}
                    />

                    <Text style={styles.inputLabel}>HABIT DESCRIPTION</Text>
                    <TextInput
                        multiline
                        placeholder="Define the core objective of this neural habit..."
                        placeholderTextColor="rgba(244,241,250,0.34)"
                        style={[styles.input, styles.textArea]}
                    />

                    <View style={styles.taskHeader}>
                        <Text style={styles.sectionTitle}>
                            All <Text style={styles.sectionTitlePink}>Tasks</Text>
                        </Text>

                        <Pressable style={styles.addButton}>
                            <Ionicons name="add" size={22} color="#FFFFFF" />
                            <Text style={styles.addText}>ADD</Text>
                        </Pressable>
                    </View>

                    <View style={styles.taskList}>
                        {mockTasks.map((task) => (
                            <View key={task.id} style={styles.taskRow}>
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
                </ScrollView>

                <View style={styles.saveArea}>
                    <Pressable style={styles.saveButton}>
                        <Text style={styles.saveText}>SAVE</Text>
                    </Pressable>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    container: { flex: 1 },
    contentWithButton: {
        paddingHorizontal: 35,
        paddingTop: 26,
        paddingBottom: 130,
    },
    title: {
        color: '#C992F0',
        fontSize: 36,
        fontWeight: '900',
    },
    titleBlue: { color: '#2F8BFF' },
    subtitle: {
        marginTop: 14,
        maxWidth: 310,
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
    smallTextArea: {
        minHeight: 69,
        borderRadius: 28,
        paddingTop: 16,
        textAlignVertical: 'top',
    },
    taskHeader: {
        marginTop: 38,
        marginBottom: 34,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sectionTitle: {
        color: '#7FB2FF',
        fontSize: 25,
        fontWeight: '900',
    },
    sectionTitlePink: { color: '#D99AF3' },
    addButton: {
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#A895FF',
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    addText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '900',
        letterSpacing: 2,
    },
    taskList: { gap: 34 },
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
    durationBox: { alignItems: 'flex-end' },
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
    recurrenceLabel: {
        marginTop: 60,
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
    saveArea: {
        position: 'absolute',
        left: 34,
        right: 34,
        bottom: 28,
    },
    saveButton: {
        height: 57,
        borderRadius: 29,
        backgroundColor: '#4D9CFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2F8BFF',
        shadowOpacity: 0.55,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 10,
    },
    saveText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 1,
    },
});
