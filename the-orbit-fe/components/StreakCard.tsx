import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import Svg, {
    Defs,
    LinearGradient as SvgGradient,
    Stop,
    Circle,
} from 'react-native-svg';

type Props = {
    streak: number;
    title: string;
    activeLabel: string;
};

export default function StreakOrbitCard({
                                            streak,
                                            title,
                                            activeLabel,
                                        }: Props) {
    return (
        <View style={styles.container}>
            {/* Glow */}
            <View style={styles.glow} />

            {/* Orbit */}
            <View style={styles.orbitWrapper}>
                <Svg
                    width={254}
                    height={254}
                    viewBox="0 0 254 254"
                >
                    <Defs>
                        <SvgGradient
                            id="grad"
                            x1="0%"
                            y1="100%"
                            x2="100%"
                            y2="0%"
                        >
                            <Stop
                                offset="0%"
                                stopColor="#2E90FF"
                            />
                            <Stop
                                offset="100%"
                                stopColor="#F4AFF7"
                            />
                        </SvgGradient>
                    </Defs>

                    {/* Main segmented ring */}
                    <Circle
                        cx="127"
                        cy="127"
                        r="103"
                        stroke="url(#grad)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="90 45"
                        rotation="-90"
                        origin="127,127"
                        fill="transparent"
                    />
                </Svg>

                {/* Inner Circle */}
                <View style={styles.innerCircle}>
                    <Text style={styles.streakLabel}>
                        STREAK
                    </Text>

                    <Text style={styles.streakValue}>
                        {streak}
                    </Text>

                    <Text style={styles.cyclesText}>
                        CYCLES
                    </Text>
                </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>
                {title}
            </Text>

            {/* Status */}
            <View style={styles.statusPill}>
                <View style={styles.dot} />

                <Text style={styles.statusText}>
                    {activeLabel}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 30,
    },

    glow: {
        position: 'absolute',
        top: 20,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#39B8FF55',
        opacity: 0.7,
    },

    orbitWrapper: {
        width: 254,
        height: 254,
        justifyContent: 'center',
        alignItems: 'center',
    },

    innerCircle: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#10293A',
        justifyContent: 'center',
        alignItems: 'center',
    },

    streakLabel: {
        color: '#D89AF8',
        fontSize: 16,
        letterSpacing: 4,
        marginBottom: 12,
    },

    streakValue: {
        color: '#F4F4F5',
        fontSize: 74,
        fontWeight: '800',
        lineHeight: 78,
    },

    cyclesText: {
        color: '#2E90FF',
        fontSize: 18,
        letterSpacing: 4,
        marginTop: 10,
    },

    title: {
        marginTop: 22,
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '800',
    },

    statusPill: {
        marginTop: 18,
        backgroundColor: '#171721',
        borderRadius: 999,
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },

    dot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#2E90FF',
        marginRight: 12,
    },

    statusText: {
        color: '#A1A1AA',
        fontSize: 14,
        letterSpacing: 2,
    },
});