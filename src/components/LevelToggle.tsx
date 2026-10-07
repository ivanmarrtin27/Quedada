import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radii, spacing } from '../theme';
import { requestSpicyLevel } from '../utils/confirmAdult';

interface Props {
  spicy: boolean;
  onChange: (spicy: boolean) => void;
  softColor: string;
  style?: ViewStyle;
}

/** Toggle Suave / Picante con feedback táctil unificado */
export function LevelToggle({ spicy, onChange, softColor, style }: Props) {
  return (
    <View style={[styles.row, style]}>
      <Pressable
        onPress={() => {
          Haptics.selectionAsync();
          requestSpicyLevel(false, onChange);
        }}
        style={({ pressed }) => [
          styles.btn,
          !spicy && { borderColor: softColor, backgroundColor: softColor + '22' },
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.text, !spicy && styles.textOn]}>Suave</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          Haptics.selectionAsync();
          if (spicy) return;
          requestSpicyLevel(true, onChange);
        }}
        style={({ pressed }) => [
          styles.btn,
          spicy && { borderColor: colors.accent, backgroundColor: colors.accent + '22' },
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.text, spicy && styles.textOn]}>Picante</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  btn: {
    flex: 1,
    height: 40,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  text: {
    color: colors.textMuted,
    fontWeight: '700',
    fontSize: 14,
  },
  textOn: {
    color: colors.text,
  },
});
