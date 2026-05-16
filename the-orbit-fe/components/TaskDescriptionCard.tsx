// components/TaskDescriptionCard.tsx

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
    title: string;
    description: string;
};

export default function TaskDescriptionCard({
                                                title,
                                                description,
                                            }: Props) {
    return (
        <LinearGradient
            colors={[
                '#14141F',
                '#191925',
                '#1F1A2A',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
        >
            {/* Top Row */}
            <View style={styles.headerRow}>
                <View style={styles.leftRow}>
                    <View style={styles.iconWrapper}>
                        <Ionicons
                            name="sparkles"
                            size={18}
                            color="#A855F7"
                        />
                    </View>

                    <Text style={styles.title}>
                        Task Overview
                    </Text>
                </View>

                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        ACTIVE
                    </Text>
                </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Content */}
            <Text style={styles.taskTitle}>
                {title}
            </Text>

            <Text style={styles.description}>
                {description}
            </Text>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: 28,
        marginHorizontal: 20,
        borderRadius: 28,
        padding: 22,
        borderWidth: 1,
        borderColor: '#2A2A36',
    },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    leftRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    iconWrapper: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#2A183D',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    title: {
        color: '#F4F4F5',
        fontSize: 20,
        fontWeight: '700',
    },

    badge: {
        backgroundColor: '#0F2B1E',
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },

    badgeText: {
        color: '#4ADE80',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
    },

    divider: {
        height: 1,
        backgroundColor: '#2A2A36',
        marginVertical: 20,
    },

    taskTitle: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 12,
    },

    description: {
        color: '#A1A1AA',
        fontSize: 16,
        lineHeight: 28,
        fontWeight: '500',
    },
});