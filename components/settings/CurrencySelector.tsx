import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, FlatList, TouchableWithoutFeedback } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
];

const CurrencySelector = () => {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectCurrency = (currency) => {
    setSelectedCurrency(currency);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Currency</Text>
      
      <TouchableOpacity 
        style={styles.selectorButton}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.currencyInfo}>
          <Text style={styles.currencySymbol}>{selectedCurrency.symbol}</Text>
          <View>
            <Text style={styles.currencyCode}>{selectedCurrency.code}</Text>
            <Text style={styles.currencyName}>{selectedCurrency.name}</Text>
          </View>
        </View>
        <ChevronRight size={20} color="#64748b" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Currency</Text>
                
                <FlatList
                  data={currencies}
                  keyExtractor={(item) => item.code}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[
                        styles.currencyItem,
                        selectedCurrency.code === item.code && styles.selectedCurrencyItem
                      ]}
                      onPress={() => handleSelectCurrency(item)}
                    >
                      <Text style={styles.currencyItemSymbol}>{item.symbol}</Text>
                      <View style={styles.currencyItemInfo}>
                        <Text style={styles.currencyItemCode}>{item.code}</Text>
                        <Text style={styles.currencyItemName}>{item.name}</Text>
                      </View>
                      {selectedCurrency.code === item.code && (
                        <View style={styles.checkmark} />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  selectorButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  currencyName: {
    fontSize: 14,
    color: '#64748b',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    textAlign: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  selectedCurrencyItem: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
  },
  currencyItemSymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  currencyItemInfo: {
    flex: 1,
  },
  currencyItemCode: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
  },
  currencyItemName: {
    fontSize: 14,
    color: '#64748b',
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0ea5e9',
  },
});

export default CurrencySelector;