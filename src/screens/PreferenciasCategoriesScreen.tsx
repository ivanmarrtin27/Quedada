import { StyleSheet, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { CATEGORIES } from '../data/categories';
import { Category, CategoryId } from '../types';
import { colors, radii, spacing } from '../theme';
import { confirmAdultContent } from '../utils/confirmAdult';
import { ScreenHeader } from '../components/ScreenHeader';
import { ScreenShell } from '../components/ui';

interface Props {
  onSelectCategory: (categoryId: CategoryId) => void;
  onBack: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PreferenciasCategoriesScreen({ onSelectCategory, onBack }: Props) {
  const handleSelect = (category: Category) => {
    if (category.ageRestricted) {
      confirmAdultContent(() => onSelectCategory(category.id));
      return;
    }
    onSelectCategory(category.id);
  };

  return (
    <ScreenShell accent={colors.accentAlt}>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <ScreenHeader title="Qué Prefieres" onBack={onBack} tint={colors.accentAlt} />

        <Animated.View entering={FadeIn.duration(400)} style={styles.intro}>
          <Text style={styles.introTitle}>Elige categoría</Text>
          <Text style={styles.introSub}>Cinco ambientes. Un solo debate.</Text>
        </Animated.View>

        <View style={styles.grid}>
          {CATEGORIES.map((category, index) => (
            <CategoryTile
              key={category.id}
              category={category}
              index={index}
              onPress={() => handleSelect(category)}
            />
          ))}
        </View>
      </SafeAreaView>
    </ScreenShell>
  );
}

function CategoryTile({
  category,
  index,
  onPress,
}: {
  category: Category;
  index: number;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      entering={FadeInDown.delay(index * 55).duration(380)}
      onPressIn={() => {
        scale.value = withSpring(0.985, { damping: 18, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={[styles.tileWrap, anim]}
    >
      <LinearGradient
        colors={[category.color + '50', category.color + '14', colors.card]}
        locations={[0, 0.45, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.tile, { borderColor: category.color + '55' }]}
      >
        <View style={styles.tileLeft}>
          <View style={[styles.accentBar, { backgroundColor: category.color }]} />
          <View style={styles.tileText}>
            <View style={styles.titleRow}>
              <Text style={styles.tileTitle}>{category.title}</Text>
              {category.ageRestricted && (
                <View style={styles.ageBadge}>
                  <Text style={styles.ageText}>Picante</Text>
                </View>
              )}
            </View>
            <Text style={styles.tileSub}>{category.subtitle}</Text>
          </View>
        </View>
        <Text style={[styles.chevron, { color: category.color }]}>›</Text>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  intro: {
    marginBottom: spacing.md,
  },
  introTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  introSub: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  grid: {
    flex: 1,
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  tileWrap: {
    flex: 1,
  },
  tile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.xl,
    borderWidth: 1.5,
    paddingRight: spacing.md,
    overflow: 'hidden',
    minHeight: 72,
  },
  tileLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    height: '100%',
  },
  accentBar: {
    width: 5,
    marginRight: spacing.md,
  },
  tileText: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingRight: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  tileTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  tileSub: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  ageBadge: {
    backgroundColor: colors.accent + '33',
    borderColor: colors.accent + '66',
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  ageText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '800',
  },
  chevron: {
    fontSize: 28,
    fontWeight: '300',
  },
});
