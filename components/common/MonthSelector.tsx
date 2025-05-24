import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface MonthSelectorProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

const MonthSelector = ({ currentMonth, onMonthChange }: MonthSelectorProps) => {
  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  // Check if next month is in the future
  const isNextMonthDisabled = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const today = new Date();
    return (
      nextMonth.getMonth() > today.getMonth() ||
      nextMonth.getFullYear() > today.getFullYear()
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={goToPreviousMonth}
      >
        <ChevronLeft size={20} color="#0f172a" />
      </TouchableOpacity>
      
      <Text style={styles.monthText}>{formatMonth(currentMonth)}</Text>
      
      <TouchableOpacity 
        style={[styles.button, isNextMonthDisabled() && styles.disabledButton]} 
        onPress={goToNextMonth}
        disabled={isNextMonthDisabled()}
      >
        <ChevronRight size={20} color={isNextMonthDisabled() ? '#94a3b8' : '#0f172a'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  disabledButton: {
    backgroundColor: '#f1f5f9',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
});

export default MonthSelector;