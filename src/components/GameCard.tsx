import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Game } from '../types';
import { colors, radii, shadows, spacing } from '../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  game: Game;
  onPress: () => void;
}

export function GameCard({ game, onPress }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.975, { damping: 18, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 220 });
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={[styles.wrap, shadows.card, animatedStyle, { shadowColor: game.color }]}
    >
      <LinearGradient
        colors={[game.color + '55', game.color + '18', colors.card]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { borderColor: game.color + '66' }]}
      >
        <View style={[styles.bar, { backgroundColor: game.color }]} />
        <View style={styles.body}>
          <View style={[styles.playersPill, { backgroundColor: game.color + '33' }]}>
            <Text style={[styles.players, { color: game.color }]}>
              {game.minPlayers}–{game.maxPlayers} jugadores
            </Text>
          </View>
          <Text style={styles.title}>{game.title}</Text>
          <Text style={styles.subtitle}>{game.subtitle}</Text>
        </View>
        <View style={[styles.chevronWrap, { backgroundColor: game.color }]}>
          <Text style={styles.chevron}>›</Text>
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
    borderRadius: radii.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.lg,
    borderWidth: 1.5,
    overflow: 'hidden',
    minHeight: 108,
  },
  bar: {
    width: 5,
    alignSelf: 'stretch',
  },
  body: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  playersPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    marginBottom: 8,
  },
  players: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  chevronWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  chevron: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.bg,
    marginTop: -1,
  },
});
