import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Check } from 'lucide-react-native';

const themes = [
  { id: 'default', name: 'Default Blue', color: '#0ea5e9' },
  { id: 'green', name: 'Money Green', color: '#10b981' },
  { id: 'purple', name: 'Royal Purple', color: '#8b5cf6' },
  { id: 'orange', name: 'Warm Orange', color: '#f59e0b' },
  { id: 'red', name: 'Ruby Red', color: '#ef4444' },
  { id: 'dark', name: 'Dark Mode', color: '#1e293b' },
];

const ThemeSelector = () => {
  const [selectedTheme, setSelectedTheme] = useState('default');

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>App Theme</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.themesContainer}
      >
        {themes.map(theme => (
          <TouchableOpacity
            key={theme.id}
            style={styles.themeItem}
            onPress={() => setSelectedTheme(theme.id)}
          >
            <View 
              style={[
                styles.colorCircle, 
                { backgroundColor: theme.color }
              ]}
            >
              {selectedTheme === theme.id && (
                <Check size={20} color="#fff" />
              )}
            </View>
            <Text style={styles.themeName}>{theme.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  themesContainer: {
    paddingRight: 16,
  },
  themeItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  colorCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeName: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default ThemeSelector;