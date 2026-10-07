import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  ZoomIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { CATEGORIES } from '../data/categories';
import { getQuestionsByCategory } from '../data/questions';
import { Choice, CategoryId } from '../types';
import { colors, radii, spacing } from '../theme';
import { PrimaryButton } from '../components/PrimaryButton';
import { BackButton } from '../components/BackButton';
import { ScreenShell } from '../components/ui';
import { shuffle } from '../utils/shuffle';
import { useRoundEndAd } from '../monetization/useRoundEndAd';

interface Props {
  categoryId: CategoryId;
  onBack: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PreferenciasGameScreen({ categoryId, onBack }: Props) {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  const [deck, setDeck] = useState(() => shuffle(getQuestionsByCategory(categoryId)));
  const [index, setIndex] = useState(0);
  const [lastChoice, setLastChoice] = useState<Choice | null>(null);
  const [stats, setStats] = useState({ A: 0, B: 0 });

  const finished = !category || deck.length === 0 || index >= deck.length;
  useRoundEndAd(Boolean(category) && finished && deck.length > 0);

  if (!category) {
    return (
      <ScreenShell>
        <SafeAreaView style={styles.safe}>
          <TopBar title="Error" tint={colors.accentAlt} onBack={onBack} />
          <View style={styles.endWrap}>
            <Text style={styles.endTitle}>Categoría no encontrada</Text>
            <PrimaryButton label="Volver" onPress={onBack} color={colors.accentAlt} />
          </View>
        </SafeAreaView>
      </ScreenShell>
    );
  }

  const question = !finished ? deck[index] : undefined;

  const choose = (choice: Choice) => {
    if (lastChoice || !question) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLastChoice(choice);
    setStats((s) => ({ ...s, [choice]: s[choice] + 1 }));
    setTimeout(() => {
      setLastChoice(null);
      setIndex((i) => i + 1);
    }, 280);
  };

  const restart = () => {
    setDeck(shuffle(getQuestionsByCategory(categoryId)));
    setIndex(0);
    setStats({ A: 0, B: 0 });
    setLastChoice(null);
  };

  if (finished) {
    const total = stats.A + stats.B;
    return (
      <ScreenShell accent={category.color}>
        <SafeAreaView style={styles.safe}>
          <TopBar title={category.title} tint={category.color} onBack={onBack} />
          <Animated.View entering={ZoomIn.duration(360)} style={styles.endWrap}>
            <Text style={[styles.endEyebrow, { color: category.color }]}>RESUMEN</Text>
            <Text style={styles.endTitle}>
              {deck.length === 0 ? 'Sin preguntas' : 'Ronda terminada'}
            </Text>
            {deck.length > 0 && total > 0 ? (
              <View style={styles.statsRow}>
                <View style={[styles.statCard, { borderColor: category.color + '66' }]}>
                  <Text style={[styles.statValue, { color: category.color }]}>{stats.A}</Text>
                  <Text style={styles.statLabel}>Opción A</Text>
                </View>
                <View style={[styles.statCard, { borderColor: colors.accent + '66' }]}>
                  <Text style={[styles.statValue, { color: colors.accent }]}>{stats.B}</Text>
                  <Text style={styles.statLabel}>Opción B</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.endSub}>
                {deck.length === 0
                  ? 'No hay preguntas en esta categoría.'
                  : 'No elegiste ninguna opción.'}
              </Text>
            )}
            {deck.length > 0 && (
              <PrimaryButton
                label="Jugar otra vez"
                color={category.color}
                onPress={restart}
                style={{ alignSelf: 'stretch', marginTop: spacing.lg }}
              />
            )}
            <PrimaryButton label="Cambiar categoría" onPress={onBack} variant="ghost" />
          </Animated.View>
        </SafeAreaView>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell accent={category.color}>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <TopBar title={category.title} tint={category.color} onBack={onBack} />

        <Animated.View entering={FadeIn.duration(350)} style={styles.hero}>
          <Text style={styles.prompt}>¿Qué prefieres?</Text>
        </Animated.View>

        <View style={styles.duel}>
          <ChoiceCard
            key={`${question!.id}-A`}
            letter="A"
            text={question!.optionA}
            accent={category.color}
            selected={lastChoice === 'A'}
            onPress={() => choose('A')}
          />

          <View style={styles.vsWrap} pointerEvents="none">
            <LinearGradient
              colors={[category.color, colors.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.vsBadge}
            >
              <Text style={styles.vsText}>VS</Text>
            </LinearGradient>
          </View>

          <ChoiceCard
            key={`${question!.id}-B`}
            letter="B"
            text={question!.optionB}
            accent={colors.accent}
            selected={lastChoice === 'B'}
            onPress={() => choose('B')}
          />
        </View>

        <Animated.View entering={FadeInUp.delay(80).duration(320)} style={styles.footer}>
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              setIndex((i) => Math.min(i + 1, deck.length));
            }}
            hitSlop={10}
            style={({ pressed }) => [styles.skipBtn, pressed && { opacity: 0.6 }]}
          >
            <Text style={styles.skipText}>Saltar esta</Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </ScreenShell>
  );
}

function TopBar({
  title,
  tint,
  onBack,
}: {
  title: string;
  tint: string;
  onBack: () => void;
}) {
  return (
    <View style={styles.topBar}>
      <BackButton onPress={onBack} tint={tint} />
      <View style={[styles.catPill, { backgroundColor: tint + '22', borderColor: tint + '55' }]}>
        <Text style={[styles.catPillText, { color: tint }]}>{title}</Text>
      </View>
      <View style={styles.topSpacer} />
    </View>
  );
}

function ChoiceCard({
  letter,
  text,
  accent,
  selected,
  onPress,
}: {
  letter: string;
  text: string;
  accent: string;
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(selected ? 0.985 : 1);
  }, [selected, scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      entering={FadeInDown.duration(300)}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 16, stiffness: 320 });
      }}
      onPressOut={() => {
        if (!selected) scale.value = withSpring(1);
      }}
      onPress={onPress}
      style={[styles.choiceWrap, style]}
    >
      <LinearGradient
        colors={
          selected
            ? [accent + '44', accent + '18']
            : [colors.cardElevated, colors.card]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.choice,
          {
            borderColor: selected ? accent : colors.border,
            shadowColor: accent,
            shadowOpacity: selected ? 0.35 : 0.12,
          },
        ]}
      >
        <View style={[styles.letterBadge, { backgroundColor: accent }]}>
          <Text style={styles.letterText}>{letter}</Text>
        </View>
        <Text style={styles.choiceText}>{text}</Text>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  catPillText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  topSpacer: {
    width: 40,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  prompt: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  duel: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
    position: 'relative',
  },
  choiceWrap: {
    flex: 1,
    maxHeight: 220,
    minHeight: 140,
  },
  choice: {
    flex: 1,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  letterBadge: {
    alignSelf: 'flex-start',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  letterText: {
    color: colors.bg,
    fontSize: 15,
    fontWeight: '900',
  },
  choiceText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  vsWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    marginTop: -22,
    alignItems: 'center',
    zIndex: 2,
  },
  vsBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.bg,
  },
  vsText: {
    color: colors.bg,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  footer: {
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },
  skipBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  skipText: {
    color: colors.textDim,
    fontSize: 14,
    fontWeight: '700',
  },
  endWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endEyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  endTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  endSub: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 36,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
});
