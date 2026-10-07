import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { APP_NAME } from '../constants/app';
import { GAMES } from '../data/games';
import { Game, GameId } from '../types';
import { colors, radii, spacing } from '../theme';
import { confirmAdultContent } from '../utils/confirmAdult';
import { GameCard } from '../components/GameCard';
import { FadeIn, ScreenShell, StaggerItem } from '../components/ui';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  onSelectGame: (gameId: GameId) => void;
  onOpenSettings: () => void;
}

export function HomeScreen({ onSelectGame, onOpenSettings }: Props) {
  const handleSelect = (game: Game) => {
    if (game.ageRestricted) {
      confirmAdultContent(() => onSelectGame(game.id));
      return;
    }
    onSelectGame(game.id);
  };

  return (
    <ScreenShell accent={colors.accentAlt}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <FadeIn>
            <View style={styles.logoRow}>
              <Image
                source={require('../../assets/quedada-logo.png')}
                style={styles.logo}
                accessibilityLabel={`Logo de ${APP_NAME}`}
              />
              <SettingsChip onPress={onOpenSettings} />
            </View>
            <Text style={styles.eyebrow}>JUEGOS CON AMIGOS</Text>
            <Text style={styles.brand}>{APP_NAME}</Text>
            <LinearGradient
              colors={[colors.accentAlt, colors.pink, colors.warning]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.brandLine}
            />
            <Text style={styles.tagline}>
              Cinco modos para una noche perfecta. Elige y juega.
            </Text>
          </FadeIn>

          <FadeIn delay={120}>
            <View style={styles.sectionRow}>
              <Text style={styles.section}>Elige un juego</Text>
              <View style={styles.countPill}>
                <Text style={styles.count}>{GAMES.length} modos</Text>
              </View>
            </View>
          </FadeIn>

          {GAMES.map((game, index) => (
            <StaggerItem key={game.id} index={index}>
              <GameCard game={game} onPress={() => handleSelect(game)} />
            </StaggerItem>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ScreenShell>
  );
}

function SettingsChip({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.94, { damping: 16, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Abrir ajustes"
      style={[styles.settingsBtn, anim]}
    >
      <Text style={styles.settingsText}>Ajustes</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.accentAlt + '66',
  },
  settingsBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.accentAlt + '55',
    backgroundColor: colors.accentAlt + '18',
    minHeight: 40,
    justifyContent: 'center',
  },
  settingsText: {
    color: colors.accentAlt,
    fontSize: 13,
    fontWeight: '800',
  },
  eyebrow: {
    color: colors.accentAlt,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  brand: {
    color: colors.text,
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1.2,
  },
  brandLine: {
    height: 4,
    width: 96,
    borderRadius: 4,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  tagline: {
    color: colors.textMuted,
    fontSize: 16,
    marginBottom: spacing.xxl,
    lineHeight: 24,
    maxWidth: 320,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  section: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  countPill: {
    backgroundColor: colors.violet + '33',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.violet + '55',
  },
  count: {
    color: colors.violet,
    fontSize: 12,
    fontWeight: '800',
  },
});
