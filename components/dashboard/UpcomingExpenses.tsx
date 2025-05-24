import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';

import { fetchUpcomingExpenses } from '@/services/predictionService';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { PredictedExpense } from '@/types';

const UpcomingExpenses = () => {
  const [upcomingExpenses, setUpcomingExpenses] = useState<PredictedExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUpcomingExpenses = async () => {
      try {
        const data = await fetchUpcomingExpenses();
        setUpcomingExpenses(data);
      } catch (error) {
        console.error('Failed to load upcoming expenses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUpcomingExpenses();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Predicted Upcoming Expenses</Text>
      
      <View style={styles.contentContainer}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#0ea5e9" style={styles.loader} />
        ) : upcomingExpenses.length > 0 ? (
          upcomingExpenses.map((expense, index) => (
            <View key={index} style={styles.expenseItem}>
              <View style={styles.expenseDetails}>
                <Text style={styles.expenseName}>{expense.merchant}</Text>
                <Text style={styles.expenseCategory}>{expense.category}</Text>
              </View>
              <View style={styles.expenseRight}>
                <Text style={styles.expenseAmount}>{formatCurrency(expense.predictedAmount)}</Text>
                <Text style={styles.expenseDate}>{formatDate(expense.predictedDate)}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>
            Not enough data to predict upcoming expenses
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  contentContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    minHeight: 100,
  },
  loader: {
    marginVertical: 20,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  expenseDetails: {
    flex: 1,
  },
  expenseName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 4,
  },
  expenseCategory: {
    fontSize: 14,
    color: '#64748b',
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 14,
    color: '#64748b',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#64748b',
  },
});

export default UpcomingExpenses;