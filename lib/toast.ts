import { Alert, Platform } from 'react-native';

export const showError = (title: string, message?: string) => {
  if (Platform.OS === 'web') {
    // Web fallback
    console.error(`${title}: ${message}`);
    return;
  }
  
  Alert.alert(
    title,
    message,
    [{ text: 'OK', style: 'default' }],
    { cancelable: true }
  );
};

export const showSuccess = (title: string, message?: string) => {
  if (Platform.OS === 'web') {
    console.log(`${title}: ${message}`);
    return;
  }
  
  Alert.alert(
    title,
    message,
    [{ text: 'OK', style: 'default' }],
    { cancelable: true }
  );
};
