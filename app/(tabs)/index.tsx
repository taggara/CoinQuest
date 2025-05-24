import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { router } from 'expo-router';

import { fetchMonthlyData, fetchRecentTransactions } from '@/services/transactionService';
import MonthlyOverview from '@/components/dashboard/MonthlyOverview';
import BudgetProgress from '@/components/dashboard/BudgetProgress';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import UpcomingExpenses from '@/components/dashboard/UpcomingExpenses';
import { Transaction } from '@/types';
import { formatCurrency } from '@/utils/formatters';

export default function DashboardScreen() {
  const [monthlyData, setMonthlyData] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
    budgetUsed: 0,
    budgetTotal: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const monthData = await fetchMonthlyData();
        const transactions = await fetchRecentTransactions(5);
        
        setMonthlyData(monthData);
        setRecentTransactions(transactions);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddTransaction = () => {
    router.push('/transaction/new');
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Finance Tracker</Text>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(monthlyData.balance)}</Text>
          </View>
        </View>

        <MonthlyOverview 
          income={monthlyData.income}
          expenses={monthlyData.expenses}
          isLoading={isLoading}
        />

        <BudgetProgress 
          used={monthlyData.budgetUsed}
          total={monthlyData.budgetTotal}
          isLoading={isLoading}
        />

        <RecentTransactions 
          transactions={recentTransactions}
          isLoading={isLoading}
        />

        <UpcomingExpenses />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleAddTransaction}>
        <Plus color="#fff" size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
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
    marginBottom: 16,
  },
  balanceContainer: {
    backgroundColor: '#0ea5e9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});