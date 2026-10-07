import { PropsWithChildren, useEffect, useState } from 'react';
import { StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme';

interface ScreenShellProps extends PropsWithChildren {
  accent?: string;
  style?: ViewStyle;
}

function FloatingOrb({
  color,
  size,
  initialX,
  initialY,
  driftX,
  driftY,
  duration,
  delay = 0,
}: {
  color: string;
  size: number;
  initialX: number;
  initialY: number;
  driftX: number;
  driftY: number;
  duration: number;
  delay?: number;
}) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    tx.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(driftX, { duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(-driftX * 0.6, { duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: duration * 0.8, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      ),
    );
    ty.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(driftY, { duration: duration * 1.1, easing: Easing.inOut(Easing.sin) }),
          withTiming(-driftY * 0.5, { duration: duration * 0.9, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      ),
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.12, { duration: duration * 1.2, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.92, { duration: duration * 1.2, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );
  }, [delay, driftX, driftY, duration, scale, tx, ty]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: initialX,
          top: initialY,
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[color + '77', color + '33', 'transparent']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

export function ScreenShell({ children, accent = colors.accentAlt, style }: ScreenShellProps) {
  const { width, height } = useWindowDimensions();

  return (
    <View style={[styles.root, style]}>
      <LinearGradient
        colors={[colors.bg, '#10182E', colors.bgSoft, colors.bg]}
        locations={[0, 0.35, 0.7, 1]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View style={styles.orbs} pointerEvents="none">
        <FloatingOrb
          color={accent}
          size={width * 0.85}
          initialX={-width * 0.25}
          initialY={-height * 0.08}
          driftX={width * 0.18}
          driftY={height * 0.12}
          duration={7200}
        />
        <FloatingOrb
          color={colors.pink}
          size={width * 0.7}
          initialX={width * 0.45}
          initialY={height * 0.08}
          driftX={-width * 0.14}
          driftY={height * 0.1}
          duration={8600}
          delay={400}
        />
        <FloatingOrb
          color={colors.orange}
          size={width * 0.75}
          initialX={-width * 0.15}
          initialY={height * 0.55}
          driftX={width * 0.2}
          driftY={-height * 0.1}
          duration={9400}
          delay={800}
        />
        <FloatingOrb
          color={colors.violet}
          size={width * 0.55}
          initialX={width * 0.4}
          initialY={height * 0.62}
          driftX={-width * 0.12}
          driftY={-height * 0.14}
          duration={7800}
          delay={200}
        />
      </View>

      <LinearGradient
        colors={['transparent', colors.bg + 'CC', colors.bg]}
        locations={[0.45, 0.82, 1]}
        style={styles.vignette}
        pointerEvents="none"
      />

      {children}
    </View>
  );
}

interface FadeInProps extends PropsWithChildren {
  delay?: number;
  style?: ViewStyle;
}

export function FadeIn({ children, delay = 0, style }: FadeInProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay)
        .duration(480)
        .easing(Easing.out(Easing.cubic))}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

interface ProgressBarProps {
  progress: number;
  color: string;
}

export function ProgressBar({ progress, color }: ProgressBarProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(Math.max(0, Math.min(progress, 1)) * trackWidth, {
      duration: 320,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, trackWidth, width]);

  const fillStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  return (
    <View
      style={styles.track}
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
    >
      <Animated.View style={[styles.fill, { backgroundColor: color }, fillStyle]} />
    </View>
  );
}

interface StaggerProps extends PropsWithChildren {
  index: number;
}

export function StaggerItem({ children, index }: StaggerProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(18);

  useEffect(() => {
    opacity.value = withDelay(
      index * 70,
      withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) }),
    );
    translateY.value = withDelay(
      index * 70,
      withTiming(0, { duration: 420, easing: Easing.out(Easing.cubic) }),
    );
  }, [index, opacity, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: colors.bg,
    overflow: 'hidden',
  },
  orbs: {
    ...StyleSheet.absoluteFillObject,
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
  },
  track: {
    height: 5,
    backgroundColor: colors.borderSoft,
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
});
