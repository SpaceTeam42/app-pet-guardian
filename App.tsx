import { StatusBar } from 'react-native';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { QueryClientProvider } from '@tanstack/react-query';

import Toast from 'react-native-toast-message';

import { ThemeProvider } from 'styled-components/native';

import { AppProvider } from '@hooks/index';

import theme from './src/styles';

import { queryClient } from './src/libs/react-query';

import { toastConfig } from '@config/toast-config';

import { Loading } from './src/components/Loading';
import { Routes } from '@routes/index';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider
          style={{ flex: 1, backgroundColor: theme.COLORS['background-color'] }}
        >
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent
            // showHideTransition="slide"
          />
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AppProvider>
              {fontsLoaded ? <Routes /> : <Loading />}

              <Toast config={toastConfig} />
            </AppProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
