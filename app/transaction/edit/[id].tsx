import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Calendar, ChevronDown } from 'lucide-react-native';

import { getTransaction, updateTransaction } from '@/services/transactionService';
import CategorySelector from '@/components/transactions/CategorySelector';
import MerchantSelector from '@/components/transactions/MerchantSelector';
import DatePicker from '@/components/common/DatePicker';
import { formatCurrency, parseAmount } from '@/utils/formatters';
import { Transaction, Category, Merchant } from '@/types';

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [amount, setAmount] = useState('');
  const [formattedAmount, setFormattedAmount] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isMerchantModalVisible, setIsMerchantModalVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (id) {
      loadTransaction();
    }
  }, [id]);

  const loadTransaction = async () => {
    try {
      const data = await getTransaction(Number(id));
      setTransaction(data);
      
      // Initialize form values
      setType(data.type);
      const amountInCents = Math.round(data.amount * 100).toString();
      setAmount(amountInCents);
      setFormattedAmount(formatCurrency(data.amount).replace('$', ''));
      
      setSelectedCategory({
        id: data.categoryId,
        name: data.category,
        type: data.type
      });
      
      setSelectedMerchant({
        id: data.merchantId,
        name: data.merchant
      });
      
      setDate(new Date(data.date));
      setNotes(data.notes || '');
      
    } catch (error) {
      console.error('Failed to load transaction:', error);
      Alert.alert('Error', 'Failed to load transaction details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setAmount(numericValue);
    
    if (numericValue) {
      const amountValue = parseFloat(numericValue) / 100;
      setFormattedAmount(formatCurrency(amountValue).replace('$', ''));
    } else {
      setFormattedAmount('');
    }
  };

  const handleUpdateTransaction = async () => {
    if (!amount || !selectedCategory || !selectedMerchant) {
      Alert.alert('Missing Information', 'Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const amountValue = parseFloat(amount) / 100;
      
      if (transaction) {
        await updateTransaction({
          id: transaction.id,
          type,
          amount: amountValue,
          category: selectedCategory.name,
          categoryId: selectedCategory.id,
          merchant: selectedMerchant.name,
          merchantId: selectedMerchant.id,
          date: date.toISOString(),
          notes
        });
      }
      
      router.back();
    } catch (error) {
      console.error('Failed to update transaction:', error);
      Alert.alert('Error', 'Failed to update transaction');
    } finally {
      setIsSubmitting(false);
    }
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
          title: 'Edit Transaction',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color="#0f172a" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'expense' ? styles.activeTypeButton : null
              ]}
              onPress={() => setType('expense')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === 'expense' ? styles.activeTypeButtonText : null
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'income' ? styles.activeTypeButton : null
              ]}
              onPress={() => setType('income')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === 'income' ? styles.activeTypeButtonText : null
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={formattedAmount}
              onChangeText={handleAmountChange}
              placeholder="0.00"
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.formContainer}>
            <TouchableOpacity 
              style={styles.inputRow}
              onPress={() => setIsCategoryModalVisible(true)}
            >
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.inputValue}>
                <Text style={selectedCategory ? styles.inputText : styles.placeholderText}>
                  {selectedCategory ? selectedCategory.name : 'Select a category'}
                </Text>
                <ChevronDown size={20} color="#64748b" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.inputRow}
              onPress={() => setIsMerchantModalVisible(true)}
            >
              <Text style={styles.inputLabel}>Merchant</Text>
              <View style={styles.inputValue}>
                <Text style={selectedMerchant ? styles.inputText : styles.placeholderText}>
                  {selectedMerchant ? selectedMerchant.name : 'Select a merchant'}
                </Text>
                <ChevronDown size={20} color="#64748b" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.inputRow}
              onPress={() => setIsDatePickerVisible(true)}
            >
              <Text style={styles.inputLabel}>Date</Text>
              <View style={styles.inputValue}>
                <Text style={styles.inputText}>
                  {date.toLocaleDateString()}
                </Text>
                <Calendar size={20} color="#64748b" />
              </View>
            </TouchableOpacity>

            <View style={styles.notesContainer}>
              <Text style={styles.inputLabel}>Notes (Optional)</Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleUpdateTransaction}
            disabled={isSubmitting}
          >
            <Text style={styles.saveButtonText}>
              {isSubmitting ? 'Updating...' : 'Update Transaction'}
            </Text>
          </TouchableOpacity>
        </View>

        <CategorySelector
          visible={isCategoryModalVisible}
          onClose={() => setIsCategoryModalVisible(false)}
          onSelect={setSelectedCategory}
          transactionType={type}
          initialSelected={selectedCategory}
        />

        <MerchantSelector
          visible={isMerchantModalVisible}
          onClose={() => setIsMerchantModalVisible(false)}
          onSelect={setSelectedMerchant}
          initialSelected={selectedMerchant}
        />

        <DatePicker
          visible={isDatePickerVisible}
          date={date}
          onConfirm={(selectedDate) => {
            setIsDatePickerVisible(false);
            setDate(selectedDate || date);
          }}
          onCancel={() => setIsDatePickerVisible(false)}
        />
      </KeyboardAvoidingView>
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
  scrollView: {
    flex: 1,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeTypeButton: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
  },
  activeTypeButtonText: {
    color: '#fff',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '500',
    color: '#0f172a',
    marginRight: 4,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '500',
    color: '#0f172a',
    minWidth: 120,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  inputLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  inputValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 16,
    color: '#0f172a',
    marginRight: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: '#94a3b8',
    marginRight: 8,
  },
  notesContainer: {
    paddingTop: 16,
  },
  notesInput: {
    marginTop: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    color: '#0f172a',
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  saveButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});