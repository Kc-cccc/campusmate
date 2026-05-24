import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { TextField } from '../components/TextField';
import { ErrorBanner } from '../components/ErrorBanner';
import { useApp } from '../context/AppContext';
import { validateEmail, validatePassword } from '../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export function WelcomeScreen(_props: Props) {
  const { theme, signIn, signUp, loginAsGuest, error } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('student@example.com');
  const [password, setPassword] = useState('campus123');
  const [formError, setFormError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function submit() {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) return setFormError(emailValidation.message);
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) return setFormError(passwordValidation.message);
    setFormError(undefined);
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen scroll={false}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ marginBottom: 26 }}>
          <AppText variant="hero">CampusMate</AppText>
          <AppText muted style={{ marginTop: 8 }}>Context-aware study assistant for deadlines, study sessions, and campus reminders.</AppText>
        </View>

        <Card>
          <ErrorBanner message={formError ?? error} />
          <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
          <Button title={mode === 'login' ? 'Login' : 'Create account'} loading={loading} onPress={submit} />
          <Button
            title={mode === 'login' ? 'No account? Sign up' : 'Already have an account? Login'}
            variant="ghost"
            onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
            style={{ marginTop: 10 }}
          />
          <Button title="Continue as guest" variant="secondary" onPress={() => void loginAsGuest()} style={{ marginTop: 10 }} />
     
        </Card>

     
      </KeyboardAvoidingView>
    </Screen>
  );
}
