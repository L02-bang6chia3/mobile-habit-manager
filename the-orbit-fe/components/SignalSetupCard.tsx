import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

type SignalSetupCardProps = {
    delay: number;
    frequency: string;
    hapticEnabled: boolean;
    onToggleHaptic: (value: boolean) => void;
    onDelayChange: (value: number) => void;
};

const CARD_GRADIENT_COLORS = ['#161625', '#191929', '#32253D'] as const;

export default function SignalSetupCard({
    delay,
    frequency,
    hapticEnabled,
    onToggleHaptic,
    onDelayChange,
}: SignalSetupCardProps) {
    return (
        <LinearGradient
            colors={CARD_GRADIENT_COLORS}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.card}
        >
            <View style={styles.headerRow}>
                <View style={styles.titleRow}>
                    <View style={styles.iconWrapper}>
                        <Ionicons name="notifications" size={18} color="#E9AFFF" />
                    </View>

                    <Text style={styles.title}>Signal Setup</Text>
                </View>

                <View style={styles.delayValueRow}>
                    <Text style={styles.delayNumber}>{delay}</Text>
                    <Text style={styles.delayMin}>MIN</Text>
                </View>
            </View>

            <Text style={styles.delayLabel}>T-MINUS DELAY</Text>

            <View style={styles.sliderWrapper}>
                <Slider
                    minimumValue={0}
                    maximumValue={60}
                    value={delay}
                    minimumTrackTintColor="#4DA3FF"
                    maximumTrackTintColor="#262638"
                    thumbTintColor="#69AFFF"
                    onValueChange={onDelayChange}
                />
            </View>

            <View style={styles.markRow}>
                <Text style={styles.markText}>0M</Text>
                <Text style={styles.markText}>30M</Text>
                <Text style={styles.markText}>60M</Text>
            </View>

            <View style={styles.frequencyRow}>
                <View>
                    <Text style={styles.frequencyTitle}>Primary Frequency</Text>
                    <Text style={styles.frequencySub}>Daily Reminder Window</Text>
                </View>

                <Text style={styles.frequencyTime}>{frequency}</Text>
            </View>

            <View style={styles.hapticContainer}>
                <Text style={styles.hapticTitle}>Haptic Feedback</Text>

                <Switch
                    value={hapticEnabled}
                    onValueChange={onToggleHaptic}
                    trackColor={{
                        false: '#2A2A36',
                        true: '#0F6D54',
                    }}
                    thumbColor="#D9D9D9"
                />
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: 28,
        marginHorizontal: 20,
        borderRadius: 30,
        padding: 22,
        borderWidth: 1,
        borderColor: '#2B2B3A',
    },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    iconWrapper: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#35263E',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    title: {
        color: '#F4F4F5',
        fontSize: 24,
        fontWeight: '700',
    },

    delayValueRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },

    delayNumber: {
        color: '#FFFFFF',
        fontSize: 42,
        fontWeight: '800',
        lineHeight: 46,
    },

    delayMin: {
        color: '#8E8EA0',
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 6,
        marginBottom: 5,
    },

    delayLabel: {
        marginTop: 26,
        color: '#6B7280',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 2,
    },

    sliderWrapper: {
        marginTop: 10,
    },

    markRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },

    markText: {
        color: '#6B7280',
        fontSize: 12,
        fontWeight: '600',
    },

    frequencyRow: {
        marginTop: 28,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#2B2B3A',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    frequencyTitle: {
        color: '#F4F4F5',
        fontSize: 18,
        fontWeight: '700',
    },

    frequencySub: {
        color: '#71717A',
        fontSize: 14,
        marginTop: 4,
    },

    frequencyTime: {
        color: '#2F80FF',
        fontSize: 16,
        fontWeight: '700',
    },

    hapticContainer: {
        marginTop: 22,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    hapticTitle: {
        color: '#F4F4F5',
        fontSize: 18,
        fontWeight: '700',
    },
});