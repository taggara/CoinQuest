import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { ArrowUp, ArrowDown } from 'lucide-react-native';
import { formatCurrency } from '@/utils/formatters';

interface MonthlyOverviewProps {
  income: number;
  expenses: number;
  isLoading: boolean;
}

const MonthlyOverview = ({ income, expenses, isLoading }: MonthlyOverviewProps) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Overview</Text>
      
      <View style={styles.overviewContainer}>
        <View style={styles.overviewItem}>
          <View style={styles.iconContainer}>
            <ArrowDown size={20} color="#10b981" />
          </View>
          <View>
            <Text style={styles.overviewLabel}>Income</Text>
            <Text style={styles.overviewAmount}>{formatCurrency(income)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.overviewItem}>
          <View style={[styles.iconContainer, styles.expenseIcon]}>
            <ArrowUp size={20} color="#ef4444" />
          </View>
          <View>
            <Text style={styles.overviewLabel}>Expenses</Text>
            <Text style={styles.overviewAmount}>{formatCurrency(expenses)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  overviewContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  overviewItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  overviewLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  overviewAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  divider: {
    width: 1,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
  },
});

export default MonthlyOverview;