import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  onPress: () => void;
  tint?: string;
  style?: ViewStyle;
}

/** Botón atrás minimalista unificado en toda la app */
export function BackButton({ onPress, tint = colors.textMuted, style }: Props) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value < 1 ? 0.55 : 1,
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.92, { damping: 18, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
      accessibilityRole="button"
      accessibilityLabel="Volver"
      style={[styles.btn, anim, style]}
    >
      <Text style={[styles.chevron, { color: tint }]}>‹</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    fontSize: 34,
    fontWeight: '300',
    marginTop: -2,
    marginLeft: -2,
  },
});
