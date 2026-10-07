import { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { VERDADES_RETOS } from '../data/verdadesRetos';
import { TruthOrDareCard } from '../types';
import { colors, radii, spacing } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { LevelToggle } from '../components/LevelToggle';
import { ScreenShell } from '../components/ui';
import { drawFromDeck, shuffle } from '../utils/shuffle';
import { useAds } from '../monetization/AdsContext';
import { VERDADES_RETOS_AD_EVERY_N_CARDS } from '../monetization/adUnits';

interface Props {
  onBack: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function buildPools(spicy: boolean) {
  const pool = VERDADES_RETOS.filter((c) => (spicy ? Boolean(c.spicy) : !c.spicy));
  return {
    verdad: shuffle(pool.filter((c) => c.type === 'verdad')),
    reto: shuffle(pool.filter((c) => c.type === 'reto')),
    source: pool,
  };
}

export function VerdadesRetosScreen({ onBack }: Props) {
  const [spicy, setSpicy] = useState(false);
  const [card, setCard] = useState<TruthOrDareCard | null>(null);
  const [queues, setQueues] = useState(() => buildPools(false));
  const cardsDrawnRef = useRef(0);
  const { showInterstitialIfNeeded } = useAds();

  const poolSize = useMemo(
    () => VERDADES_RETOS.filter((c) => (spicy ? Boolean(c.spicy) : !c.spicy)).length,
    [spicy],
  );

  const draw = (type: 'verdad' | 'reto') => {
    const source = queues.source.filter((c) => c.type === type);
    const fallback = source.length ? source : queues.source;
    if (fallback.length === 0) return;

    const { next, remaining } = drawFromDeck(queues[type], fallback);
    if (!next) return;

    setCard(next);
    setQueues((prev) => ({ ...prev, [type]: remaining }));

    cardsDrawnRef.current += 1;
    if (
      cardsDrawnRef.current > 0 &&
      cardsDrawnRef.current % VERDADES_RETOS_AD_EVERY_N_CARDS === 0
    ) {
      void showInterstitialIfNeeded();
    }
  };

  const accent =
    card?.type === 'reto'
      ? colors.accent
      : card?.type === 'verdad'
        ? colors.accentAlt
        : colors.violet;

  return (
    <ScreenShell accent={accent}>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <ScreenHeader title="Verdades o Retos" onBack={onBack} tint={colors.violet} />

        <View style={styles.top}>
          <LevelToggle
            spicy={spicy}
            softColor={colors.violet}
            onChange={(next) => {
              setSpicy(next);
              setCard(null);
              setQueues(buildPools(next));
              cardsDrawnRef.current = 0;
            }}
          />
        </View>

        <View style={styles.stage}>
          <LinearGradient
            colors={[accent + '28', accent + '08', 'transparent']}
            style={styles.stageGlow}
            pointerEvents="none"
          />

          {poolSize === 0 ? (
            <Text style={styles.empty}>No hay cartas para este nivel.</Text>
          ) : card ? (
            <Animated.View
              key={card.id}
              entering={ZoomIn.duration(280)}
              style={styles.promptWrap}
            >
              <View style={[styles.typePill, { backgroundColor: accent + '22', borderColor: accent + '66' }]}>
                <Text style={[styles.typeText, { color: accent }]}>
                  {card.type === 'verdad' ? 'VERDAD' : 'RETO'}
                </Text>
              </View>
              <Text style={styles.prompt}>{card.text}</Text>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeIn.duration(400)} style={styles.idleWrap}>
              <Text style={styles.idleTitle}>Elige tu destino</Text>
              <Text style={styles.idleSub}>
                Verdad para confesar. Reto para atreverte.
              </Text>
            </Animated.View>
          )}
        </View>

        <Animated.View entering={FadeInDown.delay(80).duration(360)} style={styles.footer}>
          <View style={styles.actions}>
            <ChoiceButton
              label="Verdad"
              subtitle="Confiesa"
              color={colors.accentAlt}
              onPress={() => draw('verdad')}
            />
            <ChoiceButton
              label="Reto"
              subtitle="Atrévete"
              color={colors.accent}
              onPress={() => draw('reto')}
            />
          </View>
        </Animated.View>
      </SafeAreaView>
    </ScreenShell>
  );
}

function ChoiceButton({
  label,
  subtitle,
  color,
  onPress,
}: {
  label: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 16, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      style={[styles.choiceWrap, style]}
    >
      <LinearGradient
        colors={[color, color + 'B8']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[styles.choiceBtn, { shadowColor: color }]}
      >
        <Text style={styles.choiceLabel}>{label}</Text>
        <Text style={styles.choiceSub}>{subtitle}</Text>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  top: {
    marginBottom: spacing.sm,
  },
  stage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    marginVertical: spacing.md,
  },
  stageGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii.xl,
  },
  promptWrap: {
    alignItems: 'center',
    width: '100%',
  },
  typePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.full,
    borderWidth: 1.5,
    marginBottom: spacing.xl,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  prompt: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  idleWrap: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  idleTitle: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.6,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  idleSub: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  empty: {
    color: colors.textDim,
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    paddingBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: spacing.md,
    width: '100%',
  },
  choiceWrap: {
    flex: 1,
    maxWidth: '50%',
  },
  choiceBtn: {
    borderRadius: radii.xl,
    paddingVertical: 22,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 96,
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  choiceLabel: {
    color: colors.bg,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  choiceSub: {
    color: colors.bg,
    opacity: 0.75,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
});
