import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { ArrowLeft, Calendar, ChevronDown } from 'lucide-react-native';

import { addTransaction } from '@/services/transactionService';
import { fetchCategories } from '@/services/categoryService';
import { fetchMerchants } from '@/services/merchantService';
import CategorySelector from '@/components/transactions/CategorySelector';
import MerchantSelector from '@/components/transactions/MerchantSelector';
import DatePicker from '@/components/common/DatePicker';
import { formatCurrency, parseAmount } from '@/utils/formatters';
import { Category, Merchant } from '@/types';

export default function NewTransactionScreen() {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const handleSaveTransaction = async () => {
    if (!amount || !selectedCategory || !selectedMerchant) {
      Alert.alert('Missing Information', 'Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const amountValue = parseFloat(amount) / 100;
      
      await addTransaction({
        type,
        amount: amountValue,
        category: selectedCategory.name,
        categoryId: selectedCategory.id,
        merchant: selectedMerchant.name,
        merchantId: selectedMerchant.id,
        date: date.toISOString(),
        notes
      });
      
      router.back();
    } catch (error) {
      console.error('Failed to save transaction:', error);
      Alert.alert('Error', 'Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'New Transaction',
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
              autoFocus
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
            onPress={handleSaveTransaction}
            disabled={isSubmitting}
          >
            <Text style={styles.saveButtonText}>
              {isSubmitting ? 'Saving...' : 'Save Transaction'}
            </Text>
          </TouchableOpacity>
        </View>

        <CategorySelector
          visible={isCategoryModalVisible}
          onClose={() => setIsCategoryModalVisible(false)}
          onSelect={setSelectedCategory}
          transactionType={type}
        />

        <MerchantSelector
          visible={isMerchantModalVisible}
          onClose={() => setIsMerchantModalVisible(false)}
          onSelect={setSelectedMerchant}
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