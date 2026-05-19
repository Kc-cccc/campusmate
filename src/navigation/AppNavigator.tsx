import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import type { MainTabParamList, RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { AddTaskScreen } from '../screens/AddTaskScreen';
import { TaskDetailScreen } from '../screens/TaskDetailScreen';
import { LocationReminderScreen } from '../screens/LocationReminderScreen';
import { StudyScreen } from '../screens/StudyScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { HelpPrivacyScreen } from '../screens/HelpPrivacyScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  const { theme } = useApp();
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          height: 98,
          paddingTop: 6,
          paddingBottom: 6
        },
        tabBarLabelStyle: theme.typography.caption,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<keyof MainTabParamList, keyof typeof Feather.glyphMap> = {
            Home: 'home',
            Tasks: 'check-square',
            Study: 'clock',
            Analytics: 'bar-chart-2',
            Settings: 'settings'
          };
          return <Feather name={icons[route.name]} color={color} size={size} />;
        }
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Tasks" component={TasksScreen} />
      <Tabs.Screen name="Study" component={StudyScreen} />
      <Tabs.Screen name="Analytics" component={AnalyticsScreen} />
      <Tabs.Screen name="Settings" component={SettingsScreen} />
    </Tabs.Navigator>
  );
}

export function AppNavigator() {
  const { theme, user } = useApp();
  const navigationTheme = theme.mode === 'dark' ? DarkTheme : DefaultTheme;
  return (
    <NavigationContainer theme={{ ...navigationTheme, colors: { ...navigationTheme.colors, background: theme.background, card: theme.surface, text: theme.text, primary: theme.primary, border: theme.border } }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="AddTask" component={AddTaskScreen} />
            <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
            <Stack.Screen name="LocationReminder" component={LocationReminderScreen} />
            <Stack.Screen name="HelpPrivacy" component={HelpPrivacyScreen} />
          </>
        ) : (
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
