import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { formatCurrency } from '@/utils/formatters';

interface BudgetProgressProps {
  used: number;
  total: number;
  isLoading: boolean;
}

const BudgetProgress = ({ used, total, isLoading }: BudgetProgressProps) => {
  const percentage = total > 0 ? Math.min(100, (used / total) * 100) : 0;
  
  let statusColor = '#10b981'; // green
  let statusText = 'On Track';
  
  if (percentage > 90) {
    statusColor = '#ef4444'; // red
    statusText = 'Over Budget';
  } else if (percentage > 70) {
    statusColor = '#f59e0b'; // amber
    statusText = 'Near Limit';
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Budget Progress</Text>
          <ActivityIndicator size="small" color="#0ea5e9" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Budget Progress</Text>
        <Text style={[styles.status, { color: statusColor }]}>{statusText}</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.amountRow}>
          <Text style={styles.usedAmount}>{formatCurrency(used)}</Text>
          <Text style={styles.totalAmount}>of {formatCurrency(total)}</Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${percentage}%`, backgroundColor: statusColor }
            ]} 
          />
        </View>
        
        <Text style={styles.percentageText}>{percentage.toFixed(0)}% used</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  usedAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginRight: 4,
  },
  totalAmount: {
    fontSize: 16,
    color: '#64748b',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'right',
  },
});

export default BudgetProgress;