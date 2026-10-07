import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, radii, shadows, spacing } from '../../theme';
import { PrimaryButton } from '../../components/PrimaryButton';

interface Props {
  onReveal: () => void;
}

const INITIAL_SECONDS = 90;

export function DiscussStep({ onReveal }: Props) {
  const [seconds, setSeconds] = useState(INITIAL_SECONDS);
  const [paused, setPaused] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const barWidth = useSharedValue(0);

  useEffect(() => {
    const ratio = Math.max(0, Math.min(1, seconds / INITIAL_SECONDS));
    barWidth.value = withTiming(ratio * trackWidth, {
      duration: 280,
      easing: Easing.linear,
    });
  }, [seconds, trackWidth, barWidth]);

  useEffect(() => {
    if (paused || seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [paused, seconds]);

  const barStyle = useAnimatedStyle(() => ({
    width: barWidth.value,
  }));

  const mm = String(Math.floor(seconds / 60));
  const ss = String(seconds % 60).padStart(2, '0');
  const urgent = seconds <= 15 && seconds > 0;
  const done = seconds <= 0;

  return (
    <Animated.View entering={FadeInDown.duration(360)} style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.kicker}>FASE DE DISCUSIÓN</Text>
        <Text style={styles.title}>Investigad</Text>
        <Text style={styles.hint}>
          Haced preguntas sin revelar la palabra. Luego votad quién creéis que es el impostor.
        </Text>
      </View>

      <LinearGradient
        colors={[
          urgent || done ? colors.accent + '33' : colors.accentAlt + '28',
          colors.card,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.timerCard,
          shadows.card,
          {
            borderColor: urgent || done ? colors.accent + '66' : colors.accentAlt + '55',
          },
        ]}
      >
        <Text style={styles.timerLabel}>Tiempo restante</Text>
        <Text style={[styles.timerValue, (urgent || done) && styles.timerUrgent]}>
          {mm}:{ss}
        </Text>
        <View
          style={styles.track}
          onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        >
          <Animated.View
            style={[
              styles.fill,
              { backgroundColor: urgent || done ? colors.accent : colors.accentAlt },
              barStyle,
            ]}
          />
        </View>
        {done && <Text style={styles.timeUp}>Tiempo agotado — podéis revelar</Text>}
        {paused && !done && <Text style={styles.paused}>En pausa</Text>}
      </LinearGradient>

      <View style={styles.controls}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setSeconds((s) => s + 30);
          }}
          style={({ pressed }) => [styles.ctrlBtn, pressed && styles.ctrlPressed]}
        >
          <Text style={styles.ctrlText}>+30 s</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setPaused((p) => !p);
          }}
          style={({ pressed }) => [
            styles.ctrlBtn,
            paused && styles.ctrlBtnOn,
            pressed && styles.ctrlPressed,
          ]}
        >
          <Text style={[styles.ctrlText, paused && styles.ctrlTextOn]}>
            {paused ? 'Reanudar' : 'Pausar'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label="Terminar y revelar"
          color={colors.accent}
          onPress={onReveal}
          style={{ alignSelf: 'stretch' }}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  kicker: {
    color: colors.accentAlt,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  hint: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.sm,
  },
  timerCard: {
    width: '100%',
    borderRadius: radii.xl,
    borderWidth: 1.5,
    padding: spacing.xl,
    alignItems: 'center',
  },
  timerLabel: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  timerValue: {
    color: colors.text,
    fontSize: 56,
    fontWeight: '800',
    marginVertical: spacing.sm,
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  timerUrgent: {
    color: colors.accent,
  },
  track: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderSoft,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  timeUp: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: '700',
    marginTop: spacing.md,
  },
  paused: {
    color: colors.accentAlt,
    fontSize: 13,
    fontWeight: '700',
    marginTop: spacing.md,
  },
  controls: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    width: '100%',
  },
  ctrlBtn: {
    flex: 1,
    height: 48,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctrlBtnOn: {
    borderColor: colors.accentAlt + '88',
    backgroundColor: colors.accentAlt + '22',
  },
  ctrlPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  ctrlText: {
    color: colors.textMuted,
    fontWeight: '800',
    fontSize: 15,
  },
  ctrlTextOn: {
    color: colors.accentAlt,
  },
  footer: {
    marginTop: spacing.xl,
  },
});
