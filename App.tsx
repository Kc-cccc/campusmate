import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.title}>CampusMate</Text>
      <Text style={styles.subtitle}>Context-aware study assistant</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F8FB',
    padding: 24
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    color: '#102033'
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#64748B'
  }
});
