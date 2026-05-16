// components/RecurringSchedule.tsx

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type RecurringDay = {
    key: string;
    label: string;
    active: boolean;
};

type RecurringScheduleProps = {
    days: readonly RecurringDay[];
};

const weekLabels = [
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT',
    'SUN',
];

export default function RecurringSchedule({ days }: RecurringScheduleProps) {
    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Recurring Schedule</Text>
                <Text style={styles.cycleText}>WEEKLY CYCLE</Text>
            </View>

            <View style={styles.weekRow}>
                {weekLabels.map((day) => (
                    <Text key={day} style={styles.weekLabel}>
                        {day}
                    </Text>
                ))}
            </View>

            <View style={styles.daysRow}>
                {days.map((day) => (
                    <TouchableOpacity
                        key={day.key}
                        activeOpacity={0.8}
                        style={[
                            styles.dayButton,
                            day.active && styles.activeDayButton,
                        ]}
                    >
                        <View
                            style={[
                                styles.innerCircle,
                                day.active && styles.activeInnerCircle,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.dayText,
                                    day.active && styles.activeDayText,
                                ]}
                            >
                                {day.label}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const SIZE = 82;
const INNER_SIZE = 62;

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        paddingHorizontal: 20,
    },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    title: {
        color: '#F4F4F5',
        fontSize: 24,
        fontWeight: '700',
    },

    cycleText: {
        color: '#2F80FF',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 2,
    },

    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 28,
        paddingHorizontal: 4,
    },

    weekLabel: {
        color: '#A1A1AA',
        fontSize: 14,
        fontWeight: '600',
        width: SIZE,
        textAlign: 'center',
    },

    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },

    dayButton: {
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        backgroundColor: '#161621',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#30303A',
    },

    activeDayButton: {
        shadowColor: '#18B4FF',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.9,
        shadowRadius: 18,
        elevation: 18,
        backgroundColor: '#39B8FF33',
    },

    innerCircle: {
        width: INNER_SIZE,
        height: INNER_SIZE,
        borderRadius: INNER_SIZE / 2,
        backgroundColor: '#1C1C2A',
        justifyContent: 'center',
        alignItems: 'center',
    },

    activeInnerCircle: {
        backgroundColor: '#1380E8',
    },

    dayText: {
        color: '#6B7280',
        fontSize: 22,
        fontWeight: '700',
    },

    activeDayText: {
        color: '#FFFFFF',
    },
});