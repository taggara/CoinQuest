import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { Calendar } from 'lucide-react-native';

interface DatePickerProps {
  visible: boolean;
  date: Date;
  onConfirm: (date: Date | null) => void;
  onCancel: () => void;
}

const DatePicker = ({ visible, date, onConfirm, onCancel }: DatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState(date);
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth());
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());

  // Generate calendar days for the selected month
  const getDaysInMonth = (month: number, year: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    
    // Get the first day of the month
    const firstDay = new Date(year, month, 1).getDay();
    
    // Add empty spaces for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const days = getDaysInMonth(selectedMonth, selectedYear);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleDayPress = (day: Date | null) => {
    if (day) {
      setSelectedDate(day);
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelectedDay = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Date</Text>
          </View>

          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={goToPreviousMonth}>
              <Text style={styles.navButton}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.monthYearText}>
              {monthNames[selectedMonth]} {selectedYear}
            </Text>
            <TouchableOpacity onPress={goToNextMonth}>
              <Text style={styles.navButton}>{'>'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weekdayHeader}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <Text key={index} style={styles.weekdayText}>{day}</Text>
            ))}
          </View>

          <View style={styles.daysContainer}>
            {days.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayButton,
                  day && isSelectedDay(day) && styles.selectedDayButton,
                  day && isToday(day) && styles.todayButton
                ]}
                onPress={() => handleDayPress(day)}
                disabled={!day}
              >
                {day ? (
                  <Text
                    style={[
                      styles.dayText,
                      isSelectedDay(day) && styles.selectedDayText,
                      isToday(day) && styles.todayText
                    ]}
                  >
                    {day.getDate()}
                  </Text>
                ) : (
                  <Text style={styles.emptyDayText}></Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 340,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    textAlign: 'center',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  navButton: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0ea5e9',
    padding: 8,
  },
  weekdayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  weekdayText: {
    width: 36,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  dayButton: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
  },
  selectedDayButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 18,
  },
  todayButton: {
    borderWidth: 1,
    borderColor: '#0ea5e9',
    borderRadius: 18,
  },
  dayText: {
    fontSize: 14,
    color: '#0f172a',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '600',
  },
  todayText: {
    color: '#0ea5e9',
    fontWeight: '600',
  },
  emptyDayText: {
    color: 'transparent',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  confirmButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#64748b',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default DatePicker;