import { useCallback, useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { PreferenciasCategoriesScreen } from './src/screens/PreferenciasCategoriesScreen';
import { PreferenciasGameScreen } from './src/screens/PreferenciasGameScreen';
import { ImpostorScreen } from './src/screens/ImpostorScreen';
import { YoNuncaScreen } from './src/screens/YoNuncaScreen';
import { VerdadesRetosScreen } from './src/screens/VerdadesRetosScreen';
import { MasProbableScreen } from './src/screens/MasProbableScreen';
import { AdsProvider } from './src/monetization/AdsContext';
import { CategoryId, GameId, Screen } from './src/types';
import { colors } from './src/theme';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [categoryId, setCategoryId] = useState<CategoryId | null>(null);

  const goHome = useCallback(() => {
    setScreen('home');
    setCategoryId(null);
  }, []);

  const openGame = (gameId: GameId) => {
    switch (gameId) {
      case 'preferencias':
        setScreen('preferenciasCategories');
        break;
      case 'impostor':
        setScreen('impostor');
        break;
      case 'yoNunca':
        setScreen('yoNunca');
        break;
      case 'verdadesRetos':
        setScreen('verdadesRetos');
        break;
      case 'masProbable':
        setScreen('masProbable');
        break;
    }
  };

  const handleHardwareBack = useCallback(() => {
    switch (screen) {
      case 'home':
        return false;
      case 'preferenciasGame':
        setCategoryId(null);
        setScreen('preferenciasCategories');
        return true;
      case 'settings':
      case 'preferenciasCategories':
      case 'impostor':
      case 'yoNunca':
      case 'verdadesRetos':
      case 'masProbable':
        goHome();
        return true;
      default:
        return false;
    }
  }, [screen, goHome]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', handleHardwareBack);
    return () => sub.remove();
  }, [handleHardwareBack]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AdsProvider>
          <View style={styles.root}>
            <StatusBar style="light" translucent />
            {screen === 'home' && (
              <HomeScreen
                onSelectGame={openGame}
                onOpenSettings={() => setScreen('settings')}
              />
            )}
            {screen === 'settings' && <SettingsScreen onBack={goHome} />}
            {screen === 'preferenciasCategories' && (
              <PreferenciasCategoriesScreen
                onBack={goHome}
                onSelectCategory={(id) => {
                  setCategoryId(id);
                  setScreen('preferenciasGame');
                }}
              />
            )}
            {screen === 'preferenciasGame' && categoryId && (
              <PreferenciasGameScreen
                key={categoryId}
                categoryId={categoryId}
                onBack={() => {
                  setCategoryId(null);
                  setScreen('preferenciasCategories');
                }}
              />
            )}
            {screen === 'impostor' && <ImpostorScreen key="impostor" onBack={goHome} />}
            {screen === 'yoNunca' && <YoNuncaScreen key="yoNunca" onBack={goHome} />}
            {screen === 'verdadesRetos' && (
              <VerdadesRetosScreen key="verdadesRetos" onBack={goHome} />
            )}
            {screen === 'masProbable' && (
              <MasProbableScreen key="masProbable" onBack={goHome} />
            )}
          </View>
        </AdsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
