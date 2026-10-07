import { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';
import { BackButton } from './BackButton';

interface Props {
  title: string;
  onBack: () => void;
  tint?: string;
  right?: ReactNode;
}

export function ScreenHeader({ title, onBack, tint, right }: Props) {
  return (
    <View style={styles.wrap}>
      <BackButton onPress={onBack} tint={tint ?? colors.textMuted} />
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>{right ?? <View style={styles.spacer} />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    marginBottom: spacing.md,
  },
  spacer: {
    width: 40,
    height: 40,
  },
  right: {
    minWidth: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
});
