import { useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { APP_NAME } from '../../constants/app';
import { THEME_COLORS } from '../../data/impostor';
import { colors, radii, shadows, spacing } from '../../theme';
import { PrimaryButton } from '../../components/PrimaryButton';

interface Props {
  playerName: string;
  playerIndex: number;
  playerCount: number;
  isImpostor: boolean;
  secretWord: string;
  category: string;
  impostorCount: number;
  onFinished: () => void;
}

export function PassPhoneStep({
  playerName,
  playerIndex,
  playerCount,
  isImpostor,
  secretWord,
  category,
  impostorCount,
  onFinished,
}: Props) {
  const { width } = useWindowDimensions();
  const cardW = Math.min(width - spacing.lg * 2, 360);
  const cardH = Math.min(cardW * 1.28, 460);
  const themeColor = THEME_COLORS[category] ?? colors.violet;
  const roleColor = isImpostor ? colors.accent : colors.success;

  const rotate = useSharedValue(0);
  const [flipped, setFlipped] = useState(false);
  const flippedSV = useSharedValue(false);

  const markFlipped = () => {
    setFlipped(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const flipOpen = () => {
    if (flippedSV.value) return;
    flippedSV.value = true;
    rotate.value = withSpring(180, { damping: 16, stiffness: 120 });
    runOnJS(markFlipped)();
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .onUpdate((e) => {
      if (flippedSV.value) return;
      const next = Math.max(0, Math.min(180, (e.translationX / cardW) * 180));
      rotate.value = next;
    })
    .onEnd((e) => {
      if (flippedSV.value) return;
      const shouldFlip = rotate.value > 75 || e.velocityX > 650;
      if (shouldFlip) {
        flippedSV.value = true;
        rotate.value = withSpring(180, { damping: 16, stiffness: 120 });
        runOnJS(markFlipped)();
      } else {
        rotate.value = withTiming(0, { duration: 220, easing: Easing.out(Easing.cubic) });
      }
    });

  const tap = Gesture.Tap().onEnd(() => {
    runOnJS(flipOpen)();
  });

  const gesture = Gesture.Exclusive(pan, tap);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateY: `${interpolate(rotate.value, [0, 180], [0, 180])}deg` },
    ],
    opacity: rotate.value >= 90 ? 0 : 1,
    zIndex: rotate.value >= 90 ? 0 : 1,
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateY: `${interpolate(rotate.value, [0, 180], [180, 360])}deg` },
    ],
    opacity: rotate.value >= 90 ? 1 : 0,
    zIndex: rotate.value >= 90 ? 1 : 0,
  }));

  const progress = (playerIndex + 1) / playerCount;

  return (
    <View style={styles.wrap}>
      <Animated.View entering={FadeIn.duration(280)} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.kicker}>CARTA SECRETA</Text>
          <Text style={styles.stepCount}>
            {playerIndex + 1}/{playerCount}
          </Text>
        </View>

        <LinearGradient
          colors={[colors.accentAlt + '28', colors.card]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.playerCard}
        >
          <View style={[styles.playerBar, { backgroundColor: colors.accentAlt }]} />
          <View style={styles.playerBody}>
            <Text style={styles.playerEyebrow}>Turno de</Text>
            <Text style={styles.playerName} numberOfLines={1}>
              {playerName}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.max(10, progress * 100)}%`,
                backgroundColor: colors.accentAlt,
              },
            ]}
          />
        </View>
      </Animated.View>

      <View style={styles.stage}>
        <GestureDetector gesture={gesture}>
          <View style={{ width: cardW, height: cardH }}>
            {/* Cover */}
            <Animated.View
              style={[styles.face, { width: cardW, height: cardH }, frontStyle, shadows.card]}
            >
              <LinearGradient
                colors={[colors.cardElevated, colors.card, colors.bgSoft]}
                locations={[0, 0.55, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.faceInner, { borderColor: colors.border }]}
              >
                <Text style={styles.coverBrand}>{APP_NAME}</Text>
                <View style={styles.coverRing}>
                  <View style={styles.coverRingInner}>
                    <Text style={styles.coverMark}>?</Text>
                  </View>
                </View>
                <Text style={styles.coverTitle}>Toca para revelar</Text>
                <Text style={styles.coverSub}>Solo tú debes ver esta carta</Text>
                <View style={[styles.coverTheme, { borderColor: themeColor + '66' }]}>
                  <View style={[styles.coverThemeDot, { backgroundColor: themeColor }]} />
                  <Text style={[styles.coverThemeText, { color: themeColor }]}>{category}</Text>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Reveal */}
            <Animated.View
              style={[
                styles.face,
                styles.faceAbsolute,
                { width: cardW, height: cardH },
                backStyle,
                shadows.card,
              ]}
            >
              <LinearGradient
                colors={[roleColor + '40', colors.card, colors.bgSoft]}
                locations={[0, 0.4, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.faceInner, styles.revealInner, { borderColor: roleColor + '77' }]}
              >
                <View style={[styles.roleAccent, { backgroundColor: roleColor }]} />

                <View style={styles.revealTop}>
                  <Text style={[styles.roleBadgeLabel, { color: roleColor }]}>TU ROL</Text>
                  <Text style={[styles.roleTitle, { color: roleColor }]}>
                    {isImpostor ? 'Impostor' : 'Inocente'}
                  </Text>
                </View>

                <View style={styles.revealCenter}>
                  {isImpostor ? (
                    <>
                      <Text style={styles.revealLead}>No tienes la palabra secreta</Text>
                      <Text style={styles.revealBody}>
                        Bluffea, haz preguntas y no te delates.
                        {'\n'}
                        En la partida hay{' '}
                        {impostorCount === 1 ? '1 impostor' : `${impostorCount} impostores`}.
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.wordLabel}>Palabra secreta</Text>
                      <Text style={styles.word}>{secretWord}</Text>
                      <View style={[styles.themePill, { backgroundColor: themeColor + '22' }]}>
                        <View style={[styles.coverThemeDot, { backgroundColor: themeColor }]} />
                        <Text style={[styles.themePillText, { color: themeColor }]}>{category}</Text>
                      </View>
                      <Text style={styles.revealBody}>Memorízala y oculta el móvil.</Text>
                    </>
                  )}
                </View>
              </LinearGradient>
            </Animated.View>
          </View>
        </GestureDetector>
      </View>

      {flipped ? (
        <Animated.View entering={FadeInUp.duration(280)} style={styles.footer}>
          <Text style={styles.footerHint}>Cuando la memorices, pasa el móvil</Text>
          <PrimaryButton
            label="Listo — siguiente jugador"
            color={colors.accent}
            onPress={onFinished}
            style={{ alignSelf: 'stretch' }}
          />
        </Animated.View>
      ) : (
        <Animated.View entering={FadeInDown.duration(240)} style={styles.footerIdle}>
          <PrimaryButton
            label="Revelar mi carta"
            color={colors.accentAlt}
            onPress={flipOpen}
            style={{ alignSelf: 'stretch' }}
          />
          <Text style={styles.idleNote}>También puedes deslizar la carta</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
  },
  header: {
    gap: spacing.sm,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kicker: {
    color: colors.accentAlt,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  stepCount: {
    color: colors.textDim,
    fontSize: 13,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: colors.accentAlt + '55',
    overflow: 'hidden',
    minHeight: 68,
  },
  playerBar: {
    width: 5,
  },
  playerBody: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  playerEyebrow: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  playerName: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.borderSoft,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  stage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  face: {
    borderRadius: radii.xl,
    backfaceVisibility: 'hidden',
  },
  faceAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  faceInner: {
    flex: 1,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    overflow: 'hidden',
  },
  coverBrand: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: spacing.lg,
  },
  coverRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: colors.accentAlt + '55',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    backgroundColor: colors.accentAlt + '12',
  },
  coverRingInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgSoft,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  coverMark: {
    color: colors.accentAlt,
    fontSize: 36,
    fontWeight: '800',
  },
  coverTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  coverSub: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  coverTheme: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.full,
    borderWidth: 1.5,
    backgroundColor: colors.bgSoft,
  },
  coverThemeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  coverThemeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  revealInner: {
    alignItems: 'stretch',
    paddingHorizontal: 0,
    paddingVertical: 0,
    justifyContent: 'flex-start',
  },
  roleAccent: {
    height: 5,
    width: '100%',
  },
  revealTop: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  roleBadgeLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 4,
  },
  roleTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  revealCenter: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    justifyContent: 'center',
  },
  revealLead: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: spacing.sm,
  },
  revealBody: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  wordLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  word: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginBottom: spacing.md,
  },
  themePill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
    marginBottom: spacing.md,
  },
  themePillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  footer: {
    gap: spacing.sm,
  },
  footerHint: {
    color: colors.textDim,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  footerIdle: {
    gap: spacing.sm,
  },
  idleNote: {
    color: colors.textDim,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
});
