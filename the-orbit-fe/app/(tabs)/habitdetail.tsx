import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrbitHeader } from '../../components/home/OrbitHeader';
import { colors } from '../../constants/theme';

const comments = [
    {
        id: '1',
        rating: 5,
        text: '"The Deep Work Sync phase completely changed my coding sessions. I’ve never felt this level of flow before."',
        name: 'Sun Nova-7',
        tier: 'Orbit Tier II',
        icon: 'person-circle-outline' as const,
    },
    {
        id: '2',
        rating: 5,
        text: '"Effective protocol for high-stress days. The Focus Hub prep really helps ground my energy."',
        name: 'Sun Orion-X',
        tier: 'Orbit Tier II',
        icon: 'happy-outline' as const,
    },
];

export default function HabitsScreen() {
    return (
        <SafeAreaView style={styles.safe}>
            <LinearGradient colors={['#060812', '#0B101C', '#050711']} style={styles.container}>
                <OrbitHeader />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.content}
                >
                    <Text style={styles.title}>
                        <Text style={styles.titleBlue}>Habits</Text> Name
                    </Text>

                    <Text style={styles.duration}>Over 2 months</Text>

                    <Text style={styles.description}>
                        A neuro-optimized trajectory designed to bypass atmospheric noise and enter a
                        state of high-yield cognitive resonance.
                    </Text>

                    <View style={styles.roadmapRow}>
                        <View style={styles.line} />
                        <Text style={styles.roadmapText}>TRAJECTORY ROADMAP</Text>
                        <View style={styles.line} />
                    </View>

                    <LinearGradient
                        colors={['rgba(36,139,255,0.85)', 'rgba(16,18,30,0.96)', 'rgba(238,139,242,0.55)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.taskCardBorder}
                    >
                        <View style={styles.taskCard}>
                            <View style={styles.taskHeader}>
                                <Text style={styles.taskTitle}>TASK DETAIL</Text>

                                <Pressable style={styles.moreButton}>
                                    <Text style={styles.moreText}>see more</Text>
                                </Pressable>
                            </View>

                            <View style={styles.taskInfo}>
                                <Text style={styles.taskLabel}>Total tasks</Text>
                                <Text style={styles.taskValue}>12 tasks</Text>
                            </View>

                            <View style={styles.taskInfo}>
                                <Text style={styles.taskLabel}>Overal time</Text>
                                <Text style={styles.taskValue}>24 hours</Text>
                            </View>
                        </View>
                    </LinearGradient>

                    <Text style={styles.commentsTitle}>COMMENTS</Text>

                    <View style={styles.commentPanel}>
                        <View style={styles.planetGlow}>
                            <LinearGradient
                                colors={['#208BFF', '#10E0FF', '#11182B']}
                                style={styles.planet}
                            >
                                <View style={styles.planetRing} />
                                <View style={styles.planetRingSmall} />
                            </LinearGradient>
                        </View>

                        {comments.map((comment) => (
                            <View key={comment.id} style={styles.commentBlock}>
                                <View style={styles.stars}>
                                    {Array.from({ length: comment.rating }).map((_, index) => (
                                        <Ionicons key={index} name="star" size={13} color="#2F8BFF" />
                                    ))}
                                </View>

                                <Text style={styles.commentText}>{comment.text}</Text>

                                <View style={styles.profileRow}>
                                    <View style={styles.avatar}>
                                        <Ionicons name={comment.icon} size={25} color="#FFFFFF" />
                                    </View>

                                    <View>
                                        <Text style={styles.profileName}>{comment.name}</Text>
                                        <Text style={styles.profileTier}>{comment.tier}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>

                    <Pressable style={styles.ctaWrap}>
                        <LinearGradient
                            colors={['#2F8BFF', '#88B9FF', '#EE93EF']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.cta}
                        >
                            <Ionicons name="sync" size={18} color="#111827" />
                            <Text style={styles.ctaText}>SYNC TO ORBIT</Text>
                        </LinearGradient>
                    </Pressable>
                </ScrollView>
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
        paddingHorizontal: 34,
        paddingTop: 26,
        paddingBottom: 140,
    },
    title: {
        color: '#B9A5FF',
        fontSize: 36,
        fontWeight: '900',
        letterSpacing: 0,
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
    description: {
        marginTop: 18,
        color: '#F4F1FA',
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 30,
    },
    roadmapRow: {
        marginTop: 54,
        marginBottom: 34,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.25)',
    },
    roadmapText: {
        color: '#F6F2FA',
        fontSize: 15,
        fontWeight: '900',
        letterSpacing: 2,
    },
    taskCardBorder: {
        borderRadius: 30,
        padding: 1.5,
        shadowColor: '#2F8BFF',
        shadowOpacity: 0.65,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
    },
    taskCard: {
        borderRadius: 29,
        padding: 30,
        backgroundColor: 'rgba(13,17,28,0.96)',
    },
    taskHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    taskTitle: {
        color: '#F7F3FA',
        fontSize: 22,
        fontWeight: '900',
    },
    moreButton: {
        borderWidth: 1,
        borderColor: '#A895FF',
        borderRadius: 999,
        paddingHorizontal: 18,
        paddingVertical: 10,
    },
    moreText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '800',
    },
    taskInfo: {
        marginTop: 22,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    taskLabel: {
        color: '#F7F3FA',
        fontSize: 16,
        fontWeight: '600',
    },
    taskValue: {
        color: '#F7F3FA',
        fontSize: 16,
        fontWeight: '700',
    },
    commentsTitle: {
        marginTop: 46,
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 2,
    },
    commentPanel: {
        marginTop: 28,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: 'rgba(80,139,255,0.18)',
        backgroundColor: 'rgba(8,13,22,0.78)',
        padding: 24,
        overflow: 'hidden',
    },
    planetGlow: {
        position: 'absolute',
        left: 70,
        top: 128,
        width: 235,
        height: 235,
        borderRadius: 118,
        shadowColor: '#00D9FF',
        shadowOpacity: 0.95,
        shadowRadius: 30,
        shadowOffset: { width: 0, height: 0 },
    },
    planet: {
        width: 235,
        height: 235,
        borderRadius: 118,
        opacity: 0.78,
        transform: [{ rotate: '-18deg' }],
    },
    planetRing: {
        position: 'absolute',
        left: -70,
        top: 92,
        width: 375,
        height: 48,
        borderRadius: 999,
        borderWidth: 4,
        borderColor: 'rgba(55,218,255,0.9)',
        transform: [{ rotate: '-10deg' }],
    },
    planetRingSmall: {
        position: 'absolute',
        left: -45,
        top: 105,
        width: 320,
        height: 32,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: 'rgba(127,229,255,0.75)',
        transform: [{ rotate: '-10deg' }],
    },
    commentBlock: {
        marginBottom: 34,
    },
    stars: {
        flexDirection: 'row',
        gap: 2,
    },
    commentText: {
        marginTop: 14,
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 26,
    },
    profileRow: {
        marginTop: 22,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#1C2B45',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileName: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '900',
    },
    profileTier: {
        marginTop: 2,
        color: '#9EC4FF',
        fontSize: 12,
        fontWeight: '600',
    },
    ctaWrap: {
        marginTop: 44,
        shadowColor: '#2F8BFF',
        shadowOpacity: 0.8,
        shadowRadius: 22,
        shadowOffset: { width: 0, height: 8 },
        elevation: 10,
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
