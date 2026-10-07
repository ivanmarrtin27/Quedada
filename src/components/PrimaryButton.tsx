import { StyleSheet, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radii, spacing } from '../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  label: string;
  onPress: () => void;
  color?: string;
  variant?: 'solid' | 'ghost' | 'outline';
  style?: ViewStyle;
}

export function PrimaryButton({
  label,
  onPress,
  color = colors.accent,
  variant = 'solid',
  style,
}: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isSolid = variant === 'solid';
  const isOutline = variant === 'outline';

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 16, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      style={[animatedStyle, style]}
    >
      {isSolid ? (
        <LinearGradient
          colors={[color, color + 'BB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.btn,
            {
              shadowColor: color,
              shadowOpacity: 0.45,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 6,
            },
          ]}
        >
          <Text style={[styles.label, { color: colors.bg }]}>{label}</Text>
        </LinearGradient>
      ) : (
        <Animated.View
          style={[
            styles.btn,
            isOutline && {
              borderColor: color,
              borderWidth: 1.5,
              backgroundColor: color + '18',
            },
            variant === 'ghost' && styles.ghost,
          ]}
        >
          <Text style={[styles.label, { color: isOutline ? color : colors.textMuted }]}>
            {label}
          </Text>
        </Animated.View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: radii.md,
    paddingVertical: 15,
    paddingHorizontal: 28,
    minWidth: 200,
    alignItems: 'center',
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.sm,
  },
  label: {
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
