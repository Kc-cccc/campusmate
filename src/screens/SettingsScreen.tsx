import React from 'react';
import { Switch, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainTabParamList, RootStackParamList } from '../types/navigation';
import type { TextScale } from '../types/models';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { useApp } from '../context/AppContext';

type Props = CompositeScreenProps<BottomTabScreenProps<MainTabParamList, 'Settings'>, NativeStackScreenProps<RootStackParamList>>;

function SettingRow({ title, subtitle, value, onChange }: { title: string; subtitle: string; value: boolean; onChange: (value: boolean) => void }) {
  const { theme } = useApp();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border }}>
      <View style={{ flex: 1, paddingRight: 16 }}>
        <AppText variant="bodyStrong">{title}</AppText>
        <AppText variant="caption" muted>{subtitle}</AppText>
      </View>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

export function SettingsScreen({ navigation }: Props) {
  const { user, preferences, setThemeMode, setTextScale, setAccessibilityMode, setNotificationsEnabled, setBackgroundLocationEnabled, signOut } = useApp();
  const textScales: TextScale[] = ['small', 'medium', 'large'];

  return (
    <Screen>
      <AppText variant="title">Settings</AppText>
      <AppText muted style={{ marginBottom: 16 }}>Personalisation, accessibility, and privacy controls.</AppText>

      <Card style={{ marginBottom: 16 }}>
        <AppText variant="label" muted>ACCOUNT</AppText>
        <AppText variant="subtitle" style={{ marginTop: 8 }}>{user?.name}</AppText>
        <AppText muted>{user?.email}</AppText>
        <Button title="Help, privacy and user manual" variant="secondary" onPress={() => navigation.navigate('HelpPrivacy')} style={{ marginTop: 14 }} />
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <AppText variant="label" muted>APPEARANCE</AppText>
        <SettingRow title="Dark mode" subtitle="Reduce brightness for night study" value={preferences.themeMode === 'dark'} onChange={(enabled) => void setThemeMode(enabled ? 'dark' : 'light')} />
        <View style={{ paddingTop: 14 }}>
          <AppText variant="bodyStrong" style={{ marginBottom: 8 }}>Text size</AppText>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {textScales.map((scale) => <Chip key={scale} label={scale} selected={preferences.textScale === scale} onPress={() => void setTextScale(scale)} />)}
          </View>
        </View>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <AppText variant="label" muted>ACCESSIBILITY & DEVICE FEATURES</AppText>
        <SettingRow title="Accessibility mode" subtitle="Larger tap targets and simpler visual hierarchy" value={preferences.accessibilityMode} onChange={(enabled) => void setAccessibilityMode(enabled)} />
        <SettingRow title="Notifications" subtitle="Schedule task deadline reminders" value={preferences.notificationsEnabled} onChange={(enabled) => void setNotificationsEnabled(enabled)} />
        <SettingRow title="Background location reminders" subtitle="Optional task-manager style location updates" value={preferences.backgroundLocationEnabled} onChange={(enabled) => void setBackgroundLocationEnabled(enabled)} />
      </Card>

      <Button title="Sign out" variant="danger" onPress={() => void signOut()} />
    </Screen>
  );
}
