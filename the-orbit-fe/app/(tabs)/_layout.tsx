import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { colors } from '../../constants/theme';

type IconName = keyof typeof Ionicons.glyphMap;

function TabIcon({
  focused,
  icon,
  activeIcon,
  color,
}: {
  focused: boolean;
  icon: IconName;
  activeIcon: IconName;
  color: string;
}) {
  if (focused) {
    return (
      <LinearGradient
        colors={['#60a5fa', '#a855f7', '#ec4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#A855F7',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
          elevation: 6,
        }}
      >
        <Ionicons name={activeIcon} size={21} color={color} />
      </LinearGradient>
    );
  }

  return (
    <View
      style={{
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <Ionicons name={icon} size={21} color={color} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 92,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          backgroundColor: '#1A1A1A',
          borderTopWidth: 0,
          paddingTop: 10,
          paddingBottom: 14,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          letterSpacing: 1.5,
          fontWeight: '700',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'HOME',
          tabBarLabel: ({ focused, color }) =>
            focused ? null : (
              <Text style={{ color, fontSize: 10, letterSpacing: 1.5, fontWeight: '700', marginTop: 4 }}>
                HOME
              </Text>
            ),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} icon="home-outline" activeIcon="home" />
          ),
        }}
      />

      <Tabs.Screen
        name="library"
        options={{
          title: 'LIBRARY',
          tabBarLabel: ({ focused, color }) =>
            focused ? null : (
              <Text style={{ color, fontSize: 10, letterSpacing: 1.5, fontWeight: '700', marginTop: 4 }}>
                LIBRARY
              </Text>
            ),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} icon="book-outline" activeIcon="book" />
          ),
        }}
      />

      <Tabs.Screen
        name="habits"
        options={{
          title: 'HABITS',
          tabBarLabel: ({ focused, color }) =>
            focused ? null : (
              <Text style={{ color, fontSize: 10, letterSpacing: 1.5, fontWeight: '700', marginTop: 4 }}>
                HABITS
              </Text>
            ),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              icon="analytics-outline"
              activeIcon="analytics"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="signal"
        options={{
          title: 'SIGNAL',
          tabBarLabel: ({ focused, color }) =>
            focused ? null : (
              <Text style={{ color, fontSize: 10, letterSpacing: 1.5, fontWeight: '700', marginTop: 4 }}>
                SIGNAL
              </Text>
            ),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              icon="sparkles-outline"
              activeIcon="sparkles"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'SETTINGS',
          tabBarLabel: ({ focused, color }) =>
            focused ? null : (
              <Text style={{ color, fontSize: 10, letterSpacing: 1.5, fontWeight: '700', marginTop: 4 }}>
                SETTINGS
              </Text>
            ),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              icon="settings-outline"
              activeIcon="settings"
            />
          ),
        }}
      />
    </Tabs>
  );
}
