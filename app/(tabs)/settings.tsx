import { useState } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Download, Upload, Trash, Info, List, Database } from 'lucide-react-native';
import { router } from 'expo-router';

import { exportData, importData, clearAllData } from '@/services/dataService';
import { logger, LogLevel } from '@/services/loggingService';
import ThemeSelector from '@/components/settings/ThemeSelector';
import CurrencySelector from '@/components/settings/CurrencySelector';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [dbHost, setDbHost] = useState('192.168.4.52');
  const [dbPort, setDbPort] = useState('5432');
  const [dbName, setDbName] = useState('coinquest');
  const [dbUser, setDbUser] = useState('admin');
  const [dbPassword, setDbPassword] = useState('');
  const [isEditingDb, setIsEditingDb] = useState(false);

  const handleExportData = async () => {
    try {
      await exportData();
      await logger.info('Data exported successfully', 'User initiated data export', 'Settings');
      Alert.alert('Success', 'Data exported successfully');
    } catch (error) {
      await logger.error('Failed to export data', error instanceof Error ? error.message : String(error), 'Settings');
      console.error('Failed to export data:', error);
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleImportData = async () => {
    Alert.alert(
      'Import Data',
      'This will overwrite your current data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Import', 
          onPress: async () => {
            try {
              await importData();
              await logger.info('Data imported successfully', 'User initiated data import', 'Settings');
              Alert.alert('Success', 'Data imported successfully');
            } catch (error) {
              await logger.error('Failed to import data', error instanceof Error ? error.message : String(error), 'Settings');
              console.error('Failed to import data:', error);
              Alert.alert('Error', 'Failed to import data');
            }
          }
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This action cannot be undone. All your financial data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              await logger.warning('All data cleared', 'User initiated data clear', 'Settings');
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              await logger.error('Failed to clear data', error instanceof Error ? error.message : String(error), 'Settings');
              console.error('Failed to clear data:', error);
              Alert.alert('Error', 'Failed to clear data');
            }
          }
        },
      ]
    );
  };

  const handleViewLogs = () => {
    router.push('/logs');
  };

  const handleSaveDbConfig = () => {
    // Here you would typically save these values to secure storage
    // and update the database connection
    Alert.alert('Success', 'Database configuration updated');
    setIsEditingDb(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#e2e8f0', true: '#0ea5e9' }}
              thumbColor={darkMode ? '#fff' : '#fff'}
            />
          </View>

          <ThemeSelector />
          <CurrencySelector />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Database Configuration</Text>
          
          {isEditingDb ? (
            <View style={styles.dbForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Host</Text>
                <TextInput
                  style={styles.input}
                  value={dbHost}
                  onChangeText={setDbHost}
                  placeholder="Database host"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Port</Text>
                <TextInput
                  style={styles.input}
                  value={dbPort}
                  onChangeText={setDbPort}
                  keyboardType="numeric"
                  placeholder="Database port"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Database Name</Text>
                <TextInput
                  style={styles.input}
                  value={dbName}
                  onChangeText={setDbName}
                  placeholder="Database name"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                  style={styles.input}
                  value={dbUser}
                  onChangeText={setDbUser}
                  placeholder="Database username"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={dbPassword}
                  onChangeText={setDbPassword}
                  secureTextEntry
                  placeholder="Database password"
                />
              </View>

              <View style={styles.dbButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setIsEditingDb(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSaveDbConfig}
                >
                  <Text style={styles.saveButtonText}>Save Configuration</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.actionItem}
              onPress={() => setIsEditingDb(true)}
            >
              <View style={styles.actionContent}>
                <Database size={20} color="#0ea5e9" style={styles.actionIcon} />
                <Text style={styles.actionLabel}>Configure Database Connection</Text>
              </View>
              <ChevronRight size={20} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Enable Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#e2e8f0', true: '#0ea5e9' }}
              thumbColor={notifications ? '#fff' : '#fff'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Biometric Authentication</Text>
            <Switch
              value={biometricAuth}
              onValueChange={setBiometricAuth}
              trackColor={{ false: '#e2e8f0', true: '#0ea5e9' }}
              thumbColor={biometricAuth ? '#fff' : '#fff'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleExportData}>
            <View style={styles.actionContent}>
              <Download size={20} color="#0ea5e9" style={styles.actionIcon} />
              <Text style={styles.actionLabel}>Export Data</Text>
            </View>
            <ChevronRight size={20} color="#64748b" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleImportData}>
            <View style={styles.actionContent}>
              <Upload size={20} color="#0ea5e9" style={styles.actionIcon} />
              <Text style={styles.actionLabel}>Import Data</Text>
            </View>
            <ChevronRight size={20} color="#64748b" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleClearData}>
            <View style={styles.actionContent}>
              <Trash size={20} color="#ef4444" style={styles.actionIcon} />
              <Text style={[styles.actionLabel, { color: '#ef4444' }]}>Clear All Data</Text>
            </View>
            <ChevronRight size={20} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={handleViewLogs}>
            <View style={styles.actionContent}>
              <List size={20} color="#0ea5e9" style={styles.actionIcon} />
              <Text style={styles.actionLabel}>View System Logs</Text>
            </View>
            <ChevronRight size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionContent}>
              <Info size={20} color="#0ea5e9" style={styles.actionIcon} />
              <Text style={styles.actionLabel}>Version 1.0.0</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0ea5e9',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#0f172a',
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: 12,
  },
  actionLabel: {
    fontSize: 16,
    color: '#0f172a',
  },
  dbForm: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#0f172a',
  },
  dbButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#64748b',
  },
  saveButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});