import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';

import TransactionListItem from '@/components/transactions/TransactionListItem';
import { Transaction } from '@/types';

interface RecentTransactionsProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const RecentTransactions = ({ transactions, isLoading }: RecentTransactionsProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => router.push('/history')}>
          <View style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight size={16} color="#64748b" />
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.transactionsContainer}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#0ea5e9" style={styles.loader} />
        ) : transactions.length > 0 ? (
          transactions.map(transaction => (
            <TransactionListItem 
              key={transaction.id} 
              transaction={transaction}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No recent transactions</Text>
        )}
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
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#64748b',
  },
  transactionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    minHeight: 100,
    justifyContent: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#64748b',
  },
});

export default RecentTransactions;