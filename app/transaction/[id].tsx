import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Edit, Trash } from 'lucide-react-native';

import { getTransaction, deleteTransaction } from '@/services/transactionService';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Transaction } from '@/types';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTransaction();
  }, [id]);

  const loadTransaction = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const data = await getTransaction(Number(id));
      setTransaction(data);
    } catch (error) {
      console.error('Failed to load transaction:', error);
      Alert.alert('Error', 'Failed to load transaction details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTransaction = () => {
    if (transaction) {
      router.push(`/transaction/edit/${transaction.id}`);
    }
  };

  const handleDeleteTransaction = () => {
    if (!transaction) return;

    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(transaction.id);
              router.back();
            } catch (error) {
              console.error('Failed to delete transaction:', error);
              Alert.alert('Error', 'Failed to delete transaction');
            }
          }
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </SafeAreaView>
    );
  }

  if (!transaction) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Transaction not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Transaction Details',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color="#0f172a" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton} onPress={handleEditTransaction}>
                <Edit size={20} color="#0ea5e9" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={handleDeleteTransaction}>
                <Trash size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.amountContainer}>
          <Text style={[
            styles.amount,
            transaction.type === 'expense' ? styles.expenseAmount : styles.incomeAmount
          ]}>
            {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
          </Text>
          <Text style={styles.date}>{formatDate(transaction.date)}</Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type</Text>
            <View style={[
              styles.typeChip,
              transaction.type === 'expense' ? styles.expenseChip : styles.incomeChip
            ]}>
              <Text style={styles.typeText}>
                {transaction.type === 'expense' ? 'Expense' : 'Income'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{transaction.category}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Merchant</Text>
            <Text style={styles.detailValue}>{transaction.merchant}</Text>
          </View>

          {transaction.notes && (
            <>
              <View style={styles.divider} />
              <View style={styles.notesContainer}>
                <Text style={styles.detailLabel}>Notes</Text>
                <Text style={styles.notes}>{transaction.notes}</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#0f172a',
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  amountContainer: {
    alignItems: 'center',
    padding: 24,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  expenseAmount: {
    color: '#ef4444',
  },
  incomeAmount: {
    color: '#10b981',
  },
  date: {
    fontSize: 16,
    color: '#64748b',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  expenseChip: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  incomeChip: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  notesContainer: {
    paddingVertical: 12,
  },
  notes: {
    fontSize: 16,
    color: '#0f172a',
    marginTop: 8,
    lineHeight: 22,
  },
});