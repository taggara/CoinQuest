import { StyleSheet, View, Text } from 'react-native';
import { ArrowUp, ArrowDown } from 'lucide-react-native';

import { formatCurrency } from '@/utils/formatters';

interface BudgetCategoryCardProps {
  category: string;
  budgetAmount: number;
  spentAmount: number;
  previousMonthAmount: number;
}

const BudgetCategoryCard = ({
  category,
  budgetAmount,
  spentAmount,
  previousMonthAmount,
}: BudgetCategoryCardProps) => {
  const percentage = budgetAmount > 0 ? Math.min(100, (spentAmount / budgetAmount) * 100) : 0;
  const remaining = budgetAmount - spentAmount;
  
  const change = previousMonthAmount > 0 
    ? ((spentAmount - previousMonthAmount) / previousMonthAmount) * 100 
    : 0;
  
  const changeText = change !== 0 
    ? `${change > 0 ? '+' : ''}${change.toFixed(1)}% vs last month` 
    : 'No previous data';
  
  let statusColor = '#10b981'; // green
  
  if (percentage > 90) {
    statusColor = '#ef4444'; // red
  } else if (percentage > 70) {
    statusColor = '#f59e0b'; // amber
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.budgetAmount}>{formatCurrency(budgetAmount)}</Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: statusColor }]} />
      </View>

      <View style={styles.detailsRow}>
        <View>
          <Text style={styles.detailLabel}>Spent</Text>
          <Text style={styles.detailValue}>{formatCurrency(spentAmount)}</Text>
        </View>
        
        <View>
          <Text style={styles.detailLabel}>Remaining</Text>
          <Text style={[styles.detailValue, { color: remaining >= 0 ? '#10b981' : '#ef4444' }]}>
            {formatCurrency(Math.abs(remaining))}
            {remaining < 0 ? ' over' : ''}
          </Text>
        </View>
      </View>

      <View style={styles.changeContainer}>
        {change !== 0 && (
          <View style={styles.changeIcon}>
            {change > 0 ? (
              <ArrowUp size={12} color="#ef4444" />
            ) : (
              <ArrowDown size={12} color="#10b981" />
            )}
          </View>
        )}
        <Text style={[
          styles.changeText,
          { color: change > 0 ? '#ef4444' : change < 0 ? '#10b981' : '#64748b' }
        ]}>
          {changeText}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeIcon: {
    marginRight: 4,
  },
  changeText: {
    fontSize: 12,
    color: '#64748b',
  },
});

export default BudgetCategoryCard;