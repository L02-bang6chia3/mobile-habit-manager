import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

import TaskDetailHeader from '../components/TaskDetailHeader';
import RecurringSchedule, { type RecurringDay } from '../components/RecurringSchedule';
import SignalSetupCard from '../components/SignalSetupCard';

const SCREEN_GRADIENT_COLORS = ['#02040A', '#060814', '#090B18'] as const;
const CONTEXT_CARD_GRADIENT_COLORS = ['#14141F', '#171724', '#241B31'] as const;
const CTA_GRADIENT_COLORS = ['#0F7AEF', '#76AEFF'] as const;

const recurringDays: readonly RecurringDay[] = [
    { key: 'mon', label: 'M', active: true },
    { key: 'tue', label: 'T', active: false },
    { key: 'wed', label: 'W', active: true },
    { key: 'thu', label: 'T', active: false },
    { key: 'fri', label: 'F', active: true },
    { key: 'sat', label: 'S', active: false },
    { key: 'sun', label: 'S', active: false },
];

export default function TaskDetailScreen() {
    const [delay, setDelay] = useState(15);
    const [isHapticEnabled, setIsHapticEnabled] = useState(true);

    const handleDelayChange = useCallback((value: number) => {
        setDelay(Math.floor(value));
    }, []);

    const handleHapticToggle = useCallback((value: boolean) => {
        setIsHapticEnabled(value);
    }, []);

    return (
        <LinearGradient colors={SCREEN_GRADIENT_COLORS} style={styles.container}>
            <SafeAreaView style={styles.safe}>
                <View style={styles.topBar}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#6BA7FF" />
                    </TouchableOpacity>

                    <View style={styles.plusBadge}>
                        <Text style={styles.plusText}>PLUS</Text>
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.headerRow}>
                        <TaskDetailHeader title="Task detail" time="02:00 PM" duration="90 Minutes" />

                        <TouchableOpacity activeOpacity={0.8} style={styles.editButton}>
                            <Ionicons name="create-outline" size={22} color="#B388FF" />
                        </TouchableOpacity>
                    </View>

                    <LinearGradient
                        colors={CONTEXT_CARD_GRADIENT_COLORS}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.contextCard}
                    >
                        <Text style={styles.contextLabel}>CONTEXT</Text>

                        <Text style={styles.contextText}>
                            Intense focus session for product design. Silencing all non-critical frequencies to
                            achieve high-fidelity alignment.
                        </Text>
                    </LinearGradient>

                    <RecurringSchedule days={recurringDays} />

                    <SignalSetupCard
                        delay={delay}
                        frequency="06:15"
                        hapticEnabled={isHapticEnabled}
                        onDelayChange={handleDelayChange}
                        onToggleHaptic={handleHapticToggle}
                    />

                    <TouchableOpacity activeOpacity={0.85} style={styles.buttonShadow}>
                        <LinearGradient
                            colors={CTA_GRADIENT_COLORS}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.ctaButton}
                        >
                            <Text style={styles.ctaText}>INITIATE SYNC</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    safe: {
        flex: 1,
    },

    scrollContent: {
        paddingBottom: 40,
    },

    topBar: {
        height: 60,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    backButton: {
        padding: 4,
    },

    plusBadge: {
        backgroundColor: '#00F5A0',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
    },

    plusText: {
        color: '#001B11',
        fontSize: 12,
        fontWeight: '800',
    },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingRight: 20,
    },

    editButton: {
        marginTop: 30,
        width: 42,
        height: 42,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#4B7FFF',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#101624',
    },

    contextCard: {
        marginTop: 26,
        marginHorizontal: 20,
        borderRadius: 30,
        padding: 26,
        borderWidth: 1,
        borderColor: '#242437',
    },

    contextLabel: {
        color: '#D59CFF',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 3,
        marginBottom: 22,
    },

    contextText: {
        color: '#F4F4F5',
        fontSize: 18,
        lineHeight: 38,
        fontWeight: '400',
    },

    buttonShadow: {
        marginTop: 34,
        marginHorizontal: 20,
        shadowColor: '#1EA7FF',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.7,
        shadowRadius: 25,
        elevation: 18,
    },

    ctaButton: {
        height: 72,
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
    },

    ctaText: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: 1,
    },
});