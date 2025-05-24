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

import { fetchMerchants, addMerchant } from '@/services/merchantService';
import { Merchant } from '@/types';

interface MerchantSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (merchant: Merchant) => void;
  initialSelected?: Merchant | null;
}

const MerchantSelector = ({ 
  visible, 
  onClose, 
  onSelect,
  initialSelected
}: MerchantSelectorProps) => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [filteredMerchants, setFilteredMerchants] = useState<Merchant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingMerchant, setIsAddingMerchant] = useState(false);
  const [newMerchantName, setNewMerchantName] = useState('');
  const [newMerchantCategory, setNewMerchantCategory] = useState('');

  useEffect(() => {
    if (visible) {
      loadMerchants();
    }
  }, [visible]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMerchants(merchants);
    } else {
      const filtered = merchants.filter(merchant => 
        merchant.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMerchants(filtered);
    }
  }, [searchQuery, merchants]);

  const loadMerchants = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMerchants();
      setMerchants(data);
      setFilteredMerchants(data);
    } catch (error) {
      console.error('Failed to load merchants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMerchant = async () => {
    if (newMerchantName.trim() === '') return;
    
    try {
      const newMerchant = await addMerchant({
        name: newMerchantName.trim(),
        category: newMerchantCategory.trim() || undefined
      });
      
      setMerchants(prevMerchants => [...prevMerchants, newMerchant]);
      setNewMerchantName('');
      setNewMerchantCategory('');
      setIsAddingMerchant(false);
    } catch (error) {
      console.error('Failed to add merchant:', error);
    }
  };

  const handleMerchantSelect = (merchant: Merchant) => {
    onSelect(merchant);
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
                <Text style={styles.title}>Select Merchant</Text>
                <TouchableOpacity onPress={onClose}>
                  <X size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              <View style={styles.searchContainer}>
                <Search size={20} color="#64748b" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search merchants..."
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
                  data={filteredMerchants}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[
                        styles.merchantItem,
                        initialSelected?.id === item.id && styles.selectedMerchantItem
                      ]}
                      onPress={() => handleMerchantSelect(item)}
                    >
                      <View>
                        <Text style={[
                          styles.merchantName,
                          initialSelected?.id === item.id && styles.selectedMerchantName
                        ]}>
                          {item.name}
                        </Text>
                        {item.category && (
                          <Text style={styles.merchantCategory}>{item.category}</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>
                      No merchants found. Add a new one!
                    </Text>
                  }
                />
              )}

              {isAddingMerchant ? (
                <View style={styles.addMerchantContainer}>
                  <TextInput
                    style={styles.addMerchantInput}
                    placeholder="Merchant name"
                    value={newMerchantName}
                    onChangeText={setNewMerchantName}
                    autoFocus
                  />
                  <TextInput
                    style={styles.addMerchantInput}
                    placeholder="Category (optional)"
                    value={newMerchantCategory}
                    onChangeText={setNewMerchantCategory}
                  />
                  <View style={styles.addMerchantButtons}>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => {
                        setIsAddingMerchant(false);
                        setNewMerchantName('');
                        setNewMerchantCategory('');
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.saveButton}
                      onPress={handleAddMerchant}
                    >
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => setIsAddingMerchant(true)}
                >
                  <Plus size={20} color="#fff" />
                  <Text style={styles.addButtonText}>Add New Merchant</Text>
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
  merchantItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  selectedMerchantItem: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
  },
  merchantName: {
    fontSize: 16,
    color: '#0f172a',
    marginBottom: 2,
  },
  selectedMerchantName: {
    color: '#0ea5e9',
    fontWeight: '600',
  },
  merchantCategory: {
    fontSize: 14,
    color: '#64748b',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#64748b',
  },
  addMerchantContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  addMerchantInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  addMerchantButtons: {
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

export default MerchantSelector;