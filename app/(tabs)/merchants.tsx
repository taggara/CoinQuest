import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, Edit, Trash } from 'lucide-react-native';

import { 
  fetchMerchants, 
  addMerchant, 
  updateMerchant, 
  deleteMerchant 
} from '@/services/merchantService';
import MerchantModal from '@/components/merchants/MerchantModal';
import { Merchant } from '@/types';

export default function MerchantsScreen() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMerchants, setFilteredMerchants] = useState<Merchant[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMerchants();
  }, []);

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

  const handleAddMerchant = () => {
    setSelectedMerchant(null);
    setIsModalVisible(true);
  };

  const handleEditMerchant = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setIsModalVisible(true);
  };

  const handleDeleteMerchant = (merchant: Merchant) => {
    Alert.alert(
      'Delete Merchant',
      `Are you sure you want to delete ${merchant.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMerchant(merchant.id);
              setMerchants(prevMerchants => 
                prevMerchants.filter(m => m.id !== merchant.id)
              );
            } catch (error) {
              console.error('Failed to delete merchant:', error);
              Alert.alert('Error', 'Failed to delete merchant');
            }
          }
        },
      ]
    );
  };

  const handleSaveMerchant = async (merchant: Merchant) => {
    try {
      if (selectedMerchant) {
        // Update existing merchant
        const updatedMerchant = await updateMerchant(merchant);
        setMerchants(prevMerchants => 
          prevMerchants.map(m => m.id === updatedMerchant.id ? updatedMerchant : m)
        );
      } else {
        // Add new merchant
        const newMerchant = await addMerchant(merchant);
        setMerchants(prevMerchants => [...prevMerchants, newMerchant]);
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to save merchant:', error);
      Alert.alert('Error', 'Failed to save merchant');
    }
  };

  const renderMerchantItem = ({ item }: { item: Merchant }) => (
    <View style={styles.merchantItem}>
      <View style={styles.merchantInfo}>
        <Text style={styles.merchantName}>{item.name}</Text>
        {item.category && (
          <Text style={styles.merchantCategory}>{item.category}</Text>
        )}
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleEditMerchant(item)}
        >
          <Edit size={18} color="#0ea5e9" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleDeleteMerchant(item)}
        >
          <Trash size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={styles.title}>Merchants</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddMerchant}
        >
          <Plus size={20} color="#fff" />
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

      <FlatList
        data={filteredMerchants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMerchantItem}
        contentContainerStyle={styles.listContent}
        onRefresh={loadMerchants}
        refreshing={isLoading}
      />

      <MerchantModal
        visible={isModalVisible}
        merchant={selectedMerchant}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveMerchant}
      />
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
  addButton: {
    backgroundColor: '#0ea5e9',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#0f172a',
  },
  listContent: {
    padding: 16,
  },
  merchantItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  merchantInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  merchantCategory: {
    fontSize: 14,
    color: '#64748b',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});