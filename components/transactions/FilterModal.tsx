import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import { X } from 'lucide-react-native';

import { fetchCategories } from '@/services/categoryService';
import { fetchMerchants } from '@/services/merchantService';
import DatePicker from '@/components/common/DatePicker';
import { Category, Merchant } from '@/types';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters: any;
}

const FilterModal = ({ visible, onClose, onApply, initialFilters }: FilterModalProps) => {
  const [startDate, setStartDate] = useState<Date | null>(
    initialFilters.startDate ? new Date(initialFilters.startDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    initialFilters.endDate ? new Date(initialFilters.endDate) : null
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    initialFilters.categories || []
  );
  const [selectedMerchants, setSelectedMerchants] = useState<number[]>(
    initialFilters.merchants || []
  );
  const [transactionType, setTransactionType] = useState<'expense' | 'income' | null>(
    initialFilters.transactionType || null
  );
  const [isStartDatePickerVisible, setIsStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      loadFilterData();
    }
  }, [visible]);

  const loadFilterData = async () => {
    try {
      const categoriesData = await fetchCategories();
      const merchantsData = await fetchMerchants();
      setCategories(categoriesData);
      setMerchants(merchantsData);
    } catch (error) {
      console.error('Failed to load filter data:', error);
    }
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prevSelected => {
      if (prevSelected.includes(categoryId)) {
        return prevSelected.filter(id => id !== categoryId);
      } else {
        return [...prevSelected, categoryId];
      }
    });
  };

  const toggleMerchant = (merchantId: number) => {
    setSelectedMerchants(prevSelected => {
      if (prevSelected.includes(merchantId)) {
        return prevSelected.filter(id => id !== merchantId);
      } else {
        return [...prevSelected, merchantId];
      }
    });
  };

  const handleApply = () => {
    onApply({
      startDate: startDate?.toISOString() || null,
      endDate: endDate?.toISOString() || null,
      categories: selectedCategories,
      merchants: selectedMerchants,
      transactionType
    });
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedCategories([]);
    setSelectedMerchants([]);
    setTransactionType(null);
    
    onApply({
      startDate: null,
      endDate: null,
      categories: [],
      merchants: [],
      transactionType: null
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Text style={styles.title}>Filters</Text>
                <TouchableOpacity onPress={onClose}>
                  <X size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.scrollView}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Transaction Type</Text>
                  <View style={styles.typeSelector}>
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        transactionType === 'expense' ? styles.selectedTypeButton : null
                      ]}
                      onPress={() => setTransactionType(
                        transactionType === 'expense' ? null : 'expense'
                      )}
                    >
                      <Text style={[
                        styles.typeText,
                        transactionType === 'expense' ? styles.selectedTypeText : null
                      ]}>
                        Expense
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        transactionType === 'income' ? styles.selectedTypeButton : null
                      ]}
                      onPress={() => setTransactionType(
                        transactionType === 'income' ? null : 'income'
                      )}
                    >
                      <Text style={[
                        styles.typeText,
                        transactionType === 'income' ? styles.selectedTypeText : null
                      ]}>
                        Income
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Date Range</Text>
                  <View style={styles.dateRangeContainer}>
                    <TouchableOpacity
                      style={styles.dateButton}
                      onPress={() => setIsStartDatePickerVisible(true)}
                    >
                      <Text style={styles.dateLabel}>From</Text>
                      <Text style={startDate ? styles.dateText : styles.placeholderText}>
                        {formatDate(startDate)}
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.dateButton}
                      onPress={() => setIsEndDatePickerVisible(true)}
                    >
                      <Text style={styles.dateLabel}>To</Text>
                      <Text style={endDate ? styles.dateText : styles.placeholderText}>
                        {formatDate(endDate)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Categories</Text>
                  <View style={styles.chipContainer}>
                    {categories.map(category => (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.chip,
                          selectedCategories.includes(category.id) ? styles.selectedChip : null
                        ]}
                        onPress={() => toggleCategory(category.id)}
                      >
                        <Text style={[
                          styles.chipText,
                          selectedCategories.includes(category.id) ? styles.selectedChipText : null
                        ]}>
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Merchants</Text>
                  <View style={styles.chipContainer}>
                    {merchants.map(merchant => (
                      <TouchableOpacity
                        key={merchant.id}
                        style={[
                          styles.chip,
                          selectedMerchants.includes(merchant.id) ? styles.selectedChip : null
                        ]}
                        onPress={() => toggleMerchant(merchant.id)}
                      >
                        <Text style={[
                          styles.chipText,
                          selectedMerchants.includes(merchant.id) ? styles.selectedChipText : null
                        ]}>
                          {merchant.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>

              <View style={styles.footer}>
                <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                  <Text style={styles.applyButtonText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

      <DatePicker
        visible={isStartDatePickerVisible}
        date={startDate || new Date()}
        onConfirm={(date) => {
          setIsStartDatePickerVisible(false);
          setStartDate(date);
        }}
        onCancel={() => setIsStartDatePickerVisible(false)}
      />

      <DatePicker
        visible={isEndDatePickerVisible}
        date={endDate || new Date()}
        onConfirm={(date) => {
          setIsEndDatePickerVisible(false);
          setEndDate(date);
        }}
        onCancel={() => setIsEndDatePickerVisible(false)}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  selectedTypeButton: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  typeText: {
    fontSize: 16,
    color: '#0f172a',
  },
  selectedTypeText: {
    color: '#fff',
    fontWeight: '500',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  dateLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#0f172a',
  },
  placeholderText: {
    fontSize: 16,
    color: '#94a3b8',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: '#0ea5e9',
  },
  chipText: {
    fontSize: 14,
    color: '#0f172a',
  },
  selectedChipText: {
    color: '#fff',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  resetButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginRight: 8,
  },
  resetButtonText: {
    fontSize: 16,
    color: '#64748b',
  },
  applyButton: {
    flex: 2,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default FilterModal;