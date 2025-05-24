import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Edit } from 'lucide-react-native';

import { fetchBudgets, fetchCategorySpending } from '@/services/budgetService';
import BudgetCategoryCard from '@/components/budget/BudgetCategoryCard';
import MonthSelector from '@/components/common/MonthSelector';
import { Budget, CategorySpending } from '@/types';

export default function BudgetScreen() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categorySpending, setCategorySpending] = useState<CategorySpending[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBudgetData = async () => {
      setIsLoading(true);
      try {
        const month = currentMonth.getMonth();
        const year = currentMonth.getFullYear();
        
        const budgetData = await fetchBudgets(month, year);
        const spendingData = await fetchCategorySpending(month, year);
        
        setBudgets(budgetData);
        setCategorySpending(spendingData);
      } catch (error) {
        console.error('Failed to load budget data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBudgetData();
  }, [currentMonth]);

  const handleEditBudgets = () => {
    // Navigate to budget edit screen
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={styles.title}>Monthly Budget</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEditBudgets}>
          <Edit size={20} color="#0ea5e9" />
        </TouchableOpacity>
      </View>

      <MonthSelector 
        currentMonth={currentMonth}
        onMonthChange={setCurrentMonth}
      />

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Budget</Text>
          <Text style={styles.summaryValue}>
            ${budgets.reduce((sum, budget) => sum + budget.amount, 0).toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Spent</Text>
          <Text style={styles.summaryValue}>
            ${categorySpending.reduce((sum, cat) => sum + cat.amount, 0).toFixed(2)}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0ea5e9" style={styles.loader} />
        ) : (
          <>
            {budgets.map((budget) => {
              const spending = categorySpending.find(cs => cs.categoryId === budget.categoryId);
              const spentAmount = spending ? spending.amount : 0;
              return (
                <BudgetCategoryCard
                  key={budget.id}
                  category={budget.category}
                  budgetAmount={budget.amount}
                  spentAmount={spentAmount}
                  previousMonthAmount={spending?.previousMonthAmount || 0}
                />
              );
            })}
          </>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  editButton: {
    padding: 8,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loader: {
    marginTop: 40,
  },
});