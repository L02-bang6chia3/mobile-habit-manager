import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
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
  return (
    <View
      style={{
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: focused ? colors.purple : 'transparent',
      }}
    >
      <Ionicons name={focused ? activeIcon : icon} size={21} color={color} />
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
          height: 84,
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          backgroundColor: colors.black,
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: 12,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          letterSpacing: 1,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'HOME',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} icon="home-outline" activeIcon="home" />
          ),
        }}
      />

      <Tabs.Screen
        name="library"
        options={{
          title: 'LIBRARY',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} icon="book-outline" activeIcon="book" />
          ),
        }}
      />

      <Tabs.Screen
        name="habits"
        options={{
          title: 'HABITS',
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
