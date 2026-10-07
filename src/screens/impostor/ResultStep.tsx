import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { THEME_COLORS } from '../../data/impostor';
import { colors, radii, shadows, spacing } from '../../theme';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAds } from '../../monetization/AdsContext';

interface Props {
  impostorNames: string[];
  secretWord: string;
  category: string;
  onAgain: () => void;
  onChangeSettings: () => void;
}

export function ResultStep({
  impostorNames,
  secretWord,
  category,
  onAgain,
  onChangeSettings,
}: Props) {
  const multi = impostorNames.length > 1;
  const { showInterstitialIfNeeded } = useAds();
  const themeColor = THEME_COLORS[category] ?? colors.violet;

  useEffect(() => {
    void showInterstitialIfNeeded();
  }, [showInterstitialIfNeeded]);

  return (
    <Animated.View entering={ZoomIn.duration(360)} style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.kicker}>REVELADO</Text>
        <Text style={styles.title}>
          {multi ? 'Los impostores eran' : 'El impostor era'}
        </Text>
      </View>

      <View style={styles.names}>
        {impostorNames.map((name, i) => (
          <Animated.View
            key={`${name}-${i}`}
            entering={FadeInDown.delay(80 + i * 70).duration(320)}
          >
            <LinearGradient
              colors={[colors.accent + '44', colors.accent + '18', colors.card]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.badge, shadows.card]}
            >
              <View style={styles.badgeBar} />
              <Text style={styles.player}>{name}</Text>
            </LinearGradient>
          </Animated.View>
        ))}
      </View>

      <LinearGradient
        colors={[themeColor + '33', colors.card]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.wordCard, { borderColor: themeColor + '55' }]}
      >
        <Text style={styles.wordLabel}>Palabra secreta</Text>
        <Text style={styles.word}>{secretWord}</Text>
        <View style={[styles.themePill, { backgroundColor: themeColor + '28' }]}>
          <Text style={[styles.themePillText, { color: themeColor }]}>{category}</Text>
        </View>
      </LinearGradient>

      <View style={styles.actions}>
        <PrimaryButton
          label="Otra ronda"
          color={colors.accent}
          onPress={onAgain}
          style={{ alignSelf: 'stretch' }}
        />
        <PrimaryButton
          label="Cambiar ajustes"
          onPress={onChangeSettings}
          variant="ghost"
          style={{ marginTop: spacing.sm }}
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
    marginBottom: spacing.lg,
  },
  kicker: {
    color: colors.accentAlt,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },
  names: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: colors.accent + '66',
    overflow: 'hidden',
    minHeight: 64,
    paddingRight: spacing.lg,
  },
  badgeBar: {
    width: 5,
    alignSelf: 'stretch',
    backgroundColor: colors.accent,
    marginRight: spacing.md,
  },
  player: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
    paddingVertical: spacing.md,
  },
  wordCard: {
    width: '100%',
    borderRadius: radii.xl,
    borderWidth: 1.5,
    padding: spacing.xl,
    alignItems: 'center',
  },
  wordLabel: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  word: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.4,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  themePill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.full,
  },
  themePillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  actions: {
    marginTop: spacing.xl,
  },
});
