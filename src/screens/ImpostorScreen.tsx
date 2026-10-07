import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, BackHandler, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IMPOSTOR_WORDS, IMPOSTOR_THEMES, RANDOM_THEME } from '../data/impostor';
import { colors, spacing } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { ScreenShell } from '../components/ui';
import { pickRandom, shuffle } from '../utils/shuffle';
import { loadImpostorSetup, saveImpostorSetup } from '../utils/impostorSetupStorage';
import { SetupStep } from './impostor/SetupStep';
import { PassPhoneStep } from './impostor/PassPhoneStep';
import { DiscussStep } from './impostor/DiscussStep';
import { ResultStep } from './impostor/ResultStep';

interface Props {
  onBack: () => void;
}

type Step = 'setup' | 'pass' | 'discuss' | 'result';

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 12;

function emptyNames(count: number, previous: string[] = []): string[] {
  return Array.from({ length: count }, (_, i) => previous[i] ?? '');
}

export function ImpostorScreen({ onBack }: Props) {
  const categories = useMemo(() => IMPOSTOR_THEMES.map((t) => t.title), []);

  const [playerCount, setPlayerCount] = useState(5);
  const [impostorCount, setImpostorCount] = useState(1);
  const [names, setNames] = useState(() => emptyNames(5));
  const [category, setCategory] = useState(RANDOM_THEME);
  const [step, setStep] = useState<Step>('setup');
  const [secretWord, setSecretWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [impostorIndices, setImpostorIndices] = useState<number[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [roles, setRoles] = useState<boolean[]>([]);
  const [setupReady, setSetupReady] = useState(false);
  const advancingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const saved = await loadImpostorSetup();
      if (cancelled) return;
      if (saved) {
        const count = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, saved.playerCount));
        const maxImp = Math.max(1, Math.min(4, count - 2));
        setPlayerCount(count);
        setImpostorCount(Math.min(maxImp, Math.max(1, saved.impostorCount)));
        setNames(emptyNames(count, saved.names));
        if (saved.category === RANDOM_THEME || categories.includes(saved.category)) {
          setCategory(saved.category);
        }
      }
      setSetupReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [categories]);

  useEffect(() => {
    if (!setupReady) return;
    setNames((prev) => emptyNames(playerCount, prev));
    const maxImp = Math.max(1, Math.min(4, playerCount - 2));
    setImpostorCount((c) => Math.min(c, maxImp));
  }, [playerCount, setupReady]);

  useEffect(() => {
    if (!setupReady) return;
    void saveImpostorSetup({
      playerCount,
      impostorCount,
      names,
      category,
    });
  }, [setupReady, playerCount, impostorCount, names, category]);

  const dealRound = (forceTheme?: string) => {
    const wantRandom = (forceTheme ?? category) === RANDOM_THEME;
    let theme: string;
    let word: string;

    if (wantRandom) {
      const avoid = pickedCategory;
      const pool =
        avoid.length > 0
          ? IMPOSTOR_WORDS.filter((w) => w.category !== avoid)
          : IMPOSTOR_WORDS;
      const pick = pickRandom(pool.length > 0 ? pool : IMPOSTOR_WORDS);
      theme = pick.category;
      word = pick.word;
    } else {
      theme = forceTheme ?? category;
      const pool = IMPOSTOR_WORDS.filter((w) => w.category === theme);
      const pick = pickRandom(pool.length > 0 ? pool : IMPOSTOR_WORDS);
      word = pick.word;
      theme = pick.category;
    }

    const picks = shuffle(
      Array.from({ length: playerCount }, (_, i) => i),
    ).slice(0, impostorCount);
    const roleFlags = Array.from({ length: playerCount }, (_, i) => picks.includes(i));
    setPickedCategory(theme);
    setSecretWord(word);
    setImpostorIndices(picks.sort((a, b) => a - b));
    setRoles(roleFlags);
    setCurrentPlayer(0);
    advancingRef.current = false;
    setStep('pass');
  };

  const startGame = () => {
    dealRound(category);
  };

  const startAnotherRound = () => {
    // Con "Al azar" vuelve a sortear temática/palabra; si no, misma temática.
    dealRound(category === RANDOM_THEME ? RANDOM_THEME : pickedCategory || category);
  };

  const onPlayerFinished = () => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    if (currentPlayer + 1 >= playerCount) {
      setStep('discuss');
      return;
    }
    setCurrentPlayer((p) => p + 1);
    advancingRef.current = false;
  };

  const displayName = (i: number) => {
    const n = names[i]?.trim();
    return n || `Jugador ${i + 1}`;
  };

  const requestLeave = useCallback(() => {
    if (step === 'setup') {
      onBack();
      return;
    }
    Alert.alert('¿Salir de la partida?', 'Se perderá la ronda en curso.', [
      { text: 'Seguir', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: onBack },
    ]);
  }, [step, onBack]);

  useEffect(() => {
    if (step === 'setup') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      requestLeave();
      return true;
    });
    return () => sub.remove();
  }, [step, requestLeave]);

  return (
    <ScreenShell accent={colors.accent}>
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Impostor" onBack={requestLeave} tint={colors.accent} />

        {step === 'setup' && setupReady && (
          <SetupStep
            playerCount={playerCount}
            impostorCount={impostorCount}
            names={names}
            category={category}
            onPlayerCountChange={setPlayerCount}
            onImpostorCountChange={setImpostorCount}
            onNameChange={(index, name) => {
              setNames((prev) => prev.map((n, i) => (i === index ? name : n)));
            }}
            onCategoryChange={setCategory}
            onStart={startGame}
          />
        )}

        {step === 'pass' && roles.length > 0 && (
          <PassPhoneStep
            key={`player-${currentPlayer}`}
            playerName={displayName(currentPlayer)}
            playerIndex={currentPlayer}
            playerCount={playerCount}
            isImpostor={roles[currentPlayer]}
            secretWord={secretWord}
            category={pickedCategory}
            impostorCount={impostorCount}
            onFinished={onPlayerFinished}
          />
        )}

        {step === 'discuss' && (
          <DiscussStep onReveal={() => setStep('result')} />
        )}

        {step === 'result' && (
          <ResultStep
            impostorNames={impostorIndices.map(displayName)}
            secretWord={secretWord}
            category={pickedCategory}
            onAgain={startAnotherRound}
            onChangeSettings={() => {
              setStep('setup');
              setSecretWord('');
            }}
          />
        )}
      </SafeAreaView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
});
