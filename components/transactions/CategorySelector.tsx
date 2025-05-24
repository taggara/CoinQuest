import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Modal,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native';
import { Plus, X, Search } from 'lucide-react-native';

import { fetchCategories, addCategory } from '@/services/categoryService';
import { Category } from '@/types';

interface CategorySelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (category: Category) => void;
  transactionType: 'expense' | 'income';
  initialSelected?: Category | null;
}

const CategorySelector = ({ 
  visible, 
  onClose, 
  onSelect, 
  transactionType,
  initialSelected
}: CategorySelectorProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    if (visible) {
      loadCategories();
    }
  }, [visible, transactionType]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category => 
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCategories(transactionType);
      setCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (newCategoryName.trim() === '') return;
    
    try {
      const newCategory = await addCategory({
        name: newCategoryName.trim(),
        type: transactionType
      });
      
      setCategories(prevCategories => [...prevCategories, newCategory]);
      setNewCategoryName('');
      setIsAddingCategory(false);
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  const handleCategorySelect = (category: Category) => {
    onSelect(category);
    onClose();
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
                <Text style={styles.title}>Select Category</Text>
                <TouchableOpacity onPress={onClose}>
                  <X size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              <View style={styles.searchContainer}>
                <Search size={20} color="#64748b" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              {isLoading ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#0ea5e9" />
                </View>
              ) : (
                <FlatList
                  data={filteredCategories}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[
                        styles.categoryItem,
                        initialSelected?.id === item.id && styles.selectedCategoryItem
                      ]}
                      onPress={() => handleCategorySelect(item)}
                    >
                      <Text style={[
                        styles.categoryName,
                        initialSelected?.id === item.id && styles.selectedCategoryName
                      ]}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>
                      No categories found. Add a new one!
                    </Text>
                  }
                />
              )}

              {isAddingCategory ? (
                <View style={styles.addCategoryContainer}>
                  <TextInput
                    style={styles.addCategoryInput}
                    placeholder="Category name"
                    value={newCategoryName}
                    onChangeText={setNewCategoryName}
                    autoFocus
                  />
                  <View style={styles.addCategoryButtons}>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => {
                        setIsAddingCategory(false);
                        setNewCategoryName('');
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.saveButton}
                      onPress={handleAddCategory}
                    >
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => setIsAddingCategory(true)}
                >
                  <Plus size={20} color="#fff" />
                  <Text style={styles.addButtonText}>Add New Category</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
    height: '70%',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#0f172a',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  selectedCategoryItem: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
  },
  categoryName: {
    fontSize: 16,
    color: '#0f172a',
  },
  selectedCategoryName: {
    color: '#0ea5e9',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#64748b',
  },
  addCategoryContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  addCategoryInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  addCategoryButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#64748b',
  },
  saveButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0ea5e9',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default CategorySelector;