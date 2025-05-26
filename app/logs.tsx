import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { ArrowLeft, Trash } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { logger, LogLevel, type LogEntry } from '@/services/loggingService';

export default function LogsScreen() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const logEntries = await logger.getLogs(100);
      setLogs(logEntries);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearLogs = async () => {
    try {
      await logger.clearLogs();
      await logger.info('Logs cleared', 'User cleared system logs', 'Logs');
      await loadLogs();
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  };

  const getLogLevelStyle = (level: LogLevel) => {
    switch (level) {
      case LogLevel.ERROR:
        return styles.errorLog;
      case LogLevel.WARNING:
        return styles.warningLog;
      case LogLevel.INFO:
        return styles.infoLog;
      case LogLevel.DEBUG:
        return styles.debugLog;
      default:
        return {};
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'System Logs',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color="#0f172a" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleClearLogs}>
              <Trash size={20} color="#ef4444" />
            </TouchableOpacity>
          ),
        }}
      />

      <SafeAreaView style={styles.container} edges={['right', 'left']}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0ea5e9" style={styles.loader} />
        ) : (
          <ScrollView style={styles.scrollView}>
            {logs.length === 0 ? (
              <Text style={styles.emptyText}>No logs available</Text>
            ) : (
              logs.map((log, index) => (
                <View key={log.id || index} style={styles.logEntry}>
                  <View style={styles.logHeader}>
                    <Text style={[styles.logLevel, getLogLevelStyle(log.level)]}>
                      {log.level}
                    </Text>
                    <Text style={styles.timestamp}>
                      {new Date(log.timestamp).toLocaleString()}
                    </Text>
                  </View>
                  
                  {log.component && (
                    <Text style={styles.component}>{log.component}</Text>
                  )}
                  
                  <Text style={styles.message}>{log.message}</Text>
                  
                  {log.details && (
                    <Text style={styles.details}>{log.details}</Text>
                  )}
                </View>
              ))
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
    marginTop: 24,
  },
  logEntry: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logLevel: {
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  errorLog: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
  },
  warningLog: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    color: '#f59e0b',
  },
  infoLog: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    color: '#0ea5e9',
  },
  debugLog: {
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    color: '#64748b',
  },
  timestamp: {
    fontSize: 12,
    color: '#64748b',
  },
  component: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 4,
  },
  details: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'monospace',
  },
});