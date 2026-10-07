import { ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  IMPOSTOR_THEMES,
  RANDOM_THEME,
  THEME_COLORS,
  ImpostorTheme,
} from '../../data/impostor';
import { colors, radii, shadows, spacing } from '../../theme';
import { PrimaryButton } from '../../components/PrimaryButton';

interface Props {
  playerCount: number;
  impostorCount: number;
  names: string[];
  category: string;
  onPlayerCountChange: (n: number) => void;
  onImpostorCountChange: (n: number) => void;
  onNameChange: (index: number, name: string) => void;
  onCategoryChange: (c: string) => void;
  onStart: () => void;
}

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 12;

const RANDOM_META: ImpostorTheme = {
  id: 'random',
  title: RANDOM_THEME,
  subtitle: 'Una temática distinta cada ronda',
  color: THEME_COLORS[RANDOM_THEME],
};

export function SetupStep({
  playerCount,
  impostorCount,
  names,
  category,
  onPlayerCountChange,
  onImpostorCountChange,
  onNameChange,
  onCategoryChange,
  onStart,
}: Props) {
  const maxImpostors = Math.max(1, Math.min(4, playerCount - 2));

  return (
    <Animated.View entering={FadeInDown.duration(380)} style={styles.wrap}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.kicker}>NUEVA PARTIDA</Text>
        <Text style={styles.title}>Configura el lobby</Text>
        <Text style={styles.lead}>
          Elige jugadores, impostores y temática. Cada uno verá su carta en secreto.
        </Text>

        <View style={styles.counters}>
          <CounterCard
            label="Jugadores"
            value={playerCount}
            color={colors.accentAlt}
            onMinus={() => onPlayerCountChange(Math.max(MIN_PLAYERS, playerCount - 1))}
            onPlus={() => onPlayerCountChange(Math.min(MAX_PLAYERS, playerCount + 1))}
            canMinus={playerCount > MIN_PLAYERS}
            canPlus={playerCount < MAX_PLAYERS}
          />
          <CounterCard
            label="Impostores"
            value={impostorCount}
            color={colors.accent}
            onMinus={() => onImpostorCountChange(Math.max(1, impostorCount - 1))}
            onPlus={() => onImpostorCountChange(Math.min(maxImpostors, impostorCount + 1))}
            canMinus={impostorCount > 1}
            canPlus={impostorCount < maxImpostors}
          />
        </View>

        <Text style={styles.section}>Nombres</Text>
        <Text style={styles.namesHint}>Escríbelos aquí; se guardan para la próxima partida.</Text>
        <View style={styles.namesCard}>
          {names.map((name, i) => (
            <View key={`name-${i}`} style={styles.nameRow}>
              <View style={[styles.nameBadge, { backgroundColor: colors.accentAlt + '22' }]}>
                <Text style={styles.nameBadgeText}>{i + 1}</Text>
              </View>
              <TextInput
                value={name}
                onChangeText={(t) => onNameChange(i, t)}
                placeholder={`Jugador ${i + 1}`}
                placeholderTextColor={colors.textDim}
                style={styles.nameInput}
                maxLength={16}
                autoCorrect={false}
                autoCapitalize="words"
              />
            </View>
          ))}
        </View>

        <Text style={styles.section}>Temática</Text>
        <Text style={styles.namesHint}>Elige el mazo de palabras de esta ronda.</Text>
        <View style={styles.themeList}>
          <ThemeTile
            theme={RANDOM_META}
            selected={category === RANDOM_THEME}
            onPress={() => onCategoryChange(RANDOM_THEME)}
          />
          {IMPOSTOR_THEMES.map((theme) => (
            <ThemeTile
              key={theme.id}
              theme={theme}
              selected={category === theme.title}
              onPress={() => onCategoryChange(theme.title)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Empezar ronda"
          onPress={onStart}
          color={colors.accent}
          style={{ alignSelf: 'stretch' }}
        />
      </View>
    </Animated.View>
  );
}

function ThemeTile({
  theme,
  selected,
  onPress,
}: {
  theme: ImpostorTheme;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={({ pressed }) => [pressed && { opacity: 0.9, transform: [{ scale: 0.985 }] }]}
    >
      <LinearGradient
        colors={[theme.color + (selected ? '55' : '40'), theme.color + '14', colors.card]}
        locations={[0, 0.45, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.themeTile,
          {
            borderColor: selected ? theme.color : theme.color + '55',
            borderWidth: selected ? 2 : 1.5,
          },
        ]}
      >
        <View style={styles.themeLeft}>
          <View style={[styles.accentBar, { backgroundColor: theme.color }]} />
          <View style={styles.themeText}>
            <Text style={styles.themeTitle}>{theme.title}</Text>
            <Text style={styles.themeSub}>{theme.subtitle}</Text>
          </View>
        </View>
        {selected ? (
          <View style={[styles.selectedPill, { backgroundColor: theme.color + '33' }]}>
            <Text style={[styles.selectedPillText, { color: theme.color }]}>Elegida</Text>
          </View>
        ) : (
          <Text style={[styles.chevron, { color: theme.color }]}>›</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

function CounterCard({
  label,
  value,
  color,
  onMinus,
  onPlus,
  canMinus,
  canPlus,
}: {
  label: string;
  value: number;
  color: string;
  onMinus: () => void;
  onPlus: () => void;
  canMinus: boolean;
  canPlus: boolean;
}) {
  return (
    <LinearGradient
      colors={[color + '33', colors.card]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.counterCard, shadows.card, { borderColor: color + '55' }]}
    >
      <Text style={[styles.counterLabel, { color }]}>{label}</Text>
      <View style={styles.counterRow}>
        <Pressable
          onPress={() => {
            if (!canMinus) return;
            Haptics.selectionAsync();
            onMinus();
          }}
          style={({ pressed }) => [
            styles.stepBtn,
            { borderColor: color + '66' },
            !canMinus && styles.stepDisabled,
            pressed && canMinus && { opacity: 0.75, transform: [{ scale: 0.96 }] },
          ]}
        >
          <Text style={[styles.stepText, { color }]}>−</Text>
        </Pressable>
        <Text style={styles.counterValue}>{value}</Text>
        <Pressable
          onPress={() => {
            if (!canPlus) return;
            Haptics.selectionAsync();
            onPlus();
          }}
          style={({ pressed }) => [
            styles.stepBtn,
            { borderColor: color + '66', backgroundColor: color + '22' },
            !canPlus && styles.stepDisabled,
            pressed && canPlus && { opacity: 0.75, transform: [{ scale: 0.96 }] },
          ]}
        >
          <Text style={[styles.stepText, { color }]}>+</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.lg,
  },
  kicker: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginBottom: spacing.sm,
  },
  lead: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  counters: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  counterCard: {
    flex: 1,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    padding: spacing.md,
  },
  counterLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counterValue: {
    color: colors.text,
    fontSize: 36,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardElevated,
  },
  stepDisabled: {
    opacity: 0.35,
  },
  stepText: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: -2,
  },
  section: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  namesHint: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: -4,
    marginBottom: spacing.sm,
  },
  namesCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.xl,
    gap: spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  nameBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameBadgeText: {
    color: colors.accentAlt,
    fontWeight: '800',
    fontSize: 12,
  },
  nameInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radii.md,
    backgroundColor: colors.bgSoft,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  themeList: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  themeTile: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.xl,
    paddingRight: spacing.md,
    overflow: 'hidden',
    minHeight: 72,
  },
  themeLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 72,
  },
  accentBar: {
    width: 5,
    marginRight: spacing.md,
  },
  themeText: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingRight: spacing.sm,
  },
  themeTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  themeSub: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  chevron: {
    fontSize: 28,
    fontWeight: '300',
  },
  selectedPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.full,
  },
  selectedPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  footer: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
});
