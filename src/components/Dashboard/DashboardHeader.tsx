import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface DashboardHeaderProps {
  onCreateAd: () => void;
}

export default function DashboardHeader({ onCreateAd }: DashboardHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Manage your pet advertisements</Text>
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={onCreateAd}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>+ Create Ad</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#4B5563',
  },
  button: {
    backgroundColor: '#FFAC0D',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});