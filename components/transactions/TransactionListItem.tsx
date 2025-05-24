import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ArrowUp, ArrowDown } from 'lucide-react-native';

import { formatCurrency, formatDate } from '@/utils/formatters';
import { Transaction } from '@/types';

interface TransactionListItemProps {
  transaction: Transaction;
}

const TransactionListItem = ({ transaction }: TransactionListItemProps) => {
  const handlePress = () => {
    router.push(`/transaction/${transaction.id}`);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={[
        styles.iconContainer,
        transaction.type === 'expense' ? styles.expenseIcon : styles.incomeIcon
      ]}>
        {transaction.type === 'expense' ? (
          <ArrowUp size={18} color="#ef4444" />
        ) : (
          <ArrowDown size={18} color="#10b981" />
        )}
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.merchant}>{transaction.merchant}</Text>
        <Text style={styles.category}>{transaction.category}</Text>
      </View>
      
      <View style={styles.amountContainer}>
        <Text style={[
          styles.amount,
          transaction.type === 'expense' ? styles.expenseAmount : styles.incomeAmount
        ]}>
          {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
        </Text>
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  incomeIcon: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  detailsContainer: {
    flex: 1,
  },
  merchant: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 2,
  },
  category: {
    fontSize: 14,
    color: '#64748b',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  expenseAmount: {
    color: '#ef4444',
  },
  incomeAmount: {
    color: '#10b981',
  },
  date: {
    fontSize: 12,
    color: '#64748b',
  },
});

export default TransactionListItem;