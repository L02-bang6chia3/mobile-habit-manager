import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TaskDetailHeaderProps = {
    title: string;
    time: string;
    duration: string;
};

export default function TaskDetailHeader({
    title,
    time,
    duration,
}: TaskDetailHeaderProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={28} color="#2F80FF" />
                <Text style={styles.infoTextStart}>{time}</Text>
                <Text style={styles.separator}>|</Text>
                <Text style={styles.infoText}>{duration}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    title: {
        fontSize: 52,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: -2,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    infoTextStart: {
        marginLeft: 12,
        fontSize: 24,
        color: '#D4D4D8',
    },
    separator: {
        marginHorizontal: 16,
        fontSize: 24,
        color: '#6B7280',
    },
    infoText: {
        fontSize: 24,
        color: '#D4D4D8',
    },
});