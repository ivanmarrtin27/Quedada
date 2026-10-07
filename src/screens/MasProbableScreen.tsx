import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { MAS_PROBABLE } from '../data/masProbable';
import { colors, radii, spacing } from '../theme';
import { PrimaryButton } from '../components/PrimaryButton';
import { BackButton } from '../components/BackButton';
import { ScreenShell } from '../components/ui';
import { shuffle } from '../utils/shuffle';
import { requestSpicyLevel } from '../utils/confirmAdult';
import { useRoundEndAd } from '../monetization/useRoundEndAd';

interface Props {
  onBack: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MasProbableScreen({ onBack }: Props) {
  const { width } = useWindowDimensions();
  const [spicy, setSpicy] = useState(false);
  const [deck, setDeck] = useState(() =>
    shuffle(MAS_PROBABLE.filter((p) => !p.spicy)),
  );
  const [index, setIndex] = useState(0);

  const empty = deck.length === 0;
  const finished = !empty && index >= deck.length;
  const item = !empty && !finished ? deck[index] : undefined;
  const ringSize = Math.min(width - spacing.lg * 2, 340);

  useRoundEndAd(finished);

  const rebuildDeck = (nextSpicy: boolean) =>
    shuffle(MAS_PROBABLE.filter((p) => (nextSpicy ? true : !p.spicy)));

  const resetDeck = (nextSpicy: boolean) => {
    setSpicy(nextSpicy);
    setDeck(rebuildDeck(nextSpicy));
    setIndex(0);
  };

  if (empty || finished) {
    return (
      <ScreenShell accent={colors.lime}>
        <SafeAreaView style={styles.safe}>
          <TopBar
            spicy={spicy}
            onBack={onBack}
            onLevelChange={resetDeck}
          />
          <View style={styles.endWrap}>
            <Text style={styles.endEyebrow}>FIN DE RONDA</Text>
            <Text style={styles.endTitle}>
              {empty ? 'Sin frases' : 'Se acabó el mazo'}
            </Text>
            <Text style={styles.endSub}>
              {empty
                ? 'No hay frases para este nivel.'
                : '¿Otra pasada con las mismas reglas?'}
            </Text>
            {!empty && (
              <PrimaryButton
                label="Otra ronda"
                color={colors.lime}
                onPress={() => {
                  setDeck(rebuildDeck(spicy));
                  setIndex(0);
                }}
                style={{ alignSelf: 'stretch' }}
              />
            )}
            <PrimaryButton label="Volver al inicio" onPress={onBack} variant="ghost" />
          </View>
        </SafeAreaView>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell accent={colors.lime}>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <TopBar spicy={spicy} onBack={onBack} onLevelChange={resetDeck} />

        <View style={styles.arena}>
          <View style={[styles.ring, { width: ringSize, height: ringSize }]}>
            <LinearGradient
              colors={[colors.lime + '55', colors.success + '22', 'transparent']}
              style={styles.ringGlow}
              pointerEvents="none"
            />
            <View style={styles.ringInner}>
              <Animated.View
                key={item!.id}
                entering={FadeInDown.duration(420).easing(Easing.out(Easing.cubic))}
                style={styles.promptBlock}
              >
                <Text style={styles.who}>¿Quién…?</Text>
                <Text style={styles.prompt}>{item!.text}</Text>
              </Animated.View>
            </View>
          </View>

          <Animated.View entering={FadeIn.delay(100).duration(450)} style={styles.rule}>
            <Text style={styles.ruleTitle}>Todos a la vez</Text>
            <Text style={styles.ruleText}>
              Señaláos. Quien más votos bebe o pierde.
            </Text>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInUp.delay(60).duration(360)} style={styles.footer}>
          <NextPill onPress={() => setIndex((i) => i + 1)} />
        </Animated.View>
      </SafeAreaView>
    </ScreenShell>
  );
}

function TopBar({
  spicy,
  onBack,
  onLevelChange,
}: {
  spicy: boolean;
  onBack: () => void;
  onLevelChange: (spicy: boolean) => void;
}) {
  return (
    <View style={styles.topBar}>
      <BackButton onPress={onBack} tint={colors.lime} />

      <View style={styles.levelSwitch}>
        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            requestSpicyLevel(false, onLevelChange);
          }}
          style={[styles.levelOpt, !spicy && styles.levelOptOnSoft]}
        >
          <Text style={[styles.levelOptText, !spicy && styles.levelOptTextOn]}>Suave</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            if (spicy) return;
            requestSpicyLevel(true, onLevelChange);
          }}
          style={[styles.levelOpt, spicy && styles.levelOptOnHot]}
        >
          <Text style={[styles.levelOptText, spicy && styles.levelOptTextOn]}>Picante</Text>
        </Pressable>
      </View>
    </View>
  );
}

function NextPill({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 16, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      style={style}
    >
      <LinearGradient
        colors={[colors.lime, colors.success]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.nextPill}
      >
        <Text style={styles.nextLabel}>Siguiente frase</Text>
        <Text style={styles.nextArrow}>→</Text>
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
    marginBottom: spacing.md,
  },
  levelSwitch: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    gap: 2,
  },
  levelOpt: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.full,
  },
  levelOptOnSoft: {
    backgroundColor: colors.lime + '33',
  },
  levelOptOnHot: {
    backgroundColor: colors.accent + '33',
  },
  levelOptText: {
    color: colors.textDim,
    fontWeight: '700',
    fontSize: 13,
  },
  levelOptTextOn: {
    color: colors.text,
  },
  arena: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
  },
  ringInner: {
    width: '88%',
    height: '88%',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.lime + '66',
    backgroundColor: colors.bg + 'AA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  promptBlock: {
    alignItems: 'center',
    width: '100%',
  },
  who: {
    color: colors.lime,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  prompt: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  rule: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  ruleTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  ruleText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: spacing.lg,
  },
  nextPill: {
    height: 60,
    borderRadius: radii.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    shadowColor: colors.lime,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  nextLabel: {
    color: colors.bg,
    fontSize: 17,
    fontWeight: '800',
  },
  nextArrow: {
    color: colors.bg,
    fontSize: 20,
    fontWeight: '700',
  },
  endWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endEyebrow: {
    color: colors.lime,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  endTitle: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    marginBottom: spacing.sm,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  endSub: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
});
