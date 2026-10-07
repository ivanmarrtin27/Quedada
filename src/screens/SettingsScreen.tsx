import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { APP_NAME, APP_VERSION, PRIVACY_POLICY_URL } from '../constants/app';
import { colors, radii, shadows, spacing } from '../theme';
import { useAds } from '../monetization/AdsContext';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { FadeIn as FadeInBlock, ScreenShell, StaggerItem } from '../components/ui';

interface Props {
  onBack: () => void;
}

const SECTIONS: {
  accent: string;
  title: string;
  body: string;
  action?: 'privacy';
}[] = [
  {
    accent: colors.accentAlt,
    title: 'Cómo se juega',
    body: 'Elige un modo, pasad el móvil cuando toque y listo. En Impostor cada uno ve su carta a solas. Sin salas ni Wi‑Fi.',
  },
  {
    accent: colors.accent,
    title: 'Picante y responsabilidad',
    body: 'Los modos Picante son más atrevidos y para mayores de edad. Si bebéis, con cabeza: también podéis jugar sin alcohol (mano arriba, punto o reto).',
  },
  {
    accent: colors.violet,
    title: 'Privacidad',
    body: 'Sin cuentas ni servidores propios. Puede haber anuncios de Google (AdMob) entre rondas. Los nombres del Impostor se guardan solo en este móvil.',
    action: 'privacy',
  },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SettingsScreen({ onBack }: Props) {
  const {
    adsRemoved,
    purchasing,
    productPriceLabel,
    buyRemoveAds,
    restorePurchases,
  } = useAds();

  const openPrivacy = async () => {
    const url = PRIVACY_POLICY_URL.trim();
    if (!url) {
      Alert.alert(
        'Política de privacidad',
        `${APP_NAME} no crea cuentas. Puede mostrar anuncios de Google AdMob. Los nombres del Impostor se guardan solo en este móvil para la próxima partida.`,
      );
      return;
    }
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert('No se pudo abrir el enlace', url);
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert('No se pudo abrir el enlace', url);
    }
  };

  return (
    <ScreenShell accent={colors.accentAlt}>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <ScreenHeader title="Ajustes" onBack={onBack} tint={colors.accentAlt} />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <FadeInBlock>
            <View style={styles.hero}>
              <Image
                source={require('../../assets/quedada-logo.png')}
                style={styles.logo}
                accessibilityLabel={`Logo de ${APP_NAME}`}
              />
              <View style={styles.heroText}>
                <Text style={styles.eyebrow}>ACERCA DE</Text>
                <Text style={styles.brand}>{APP_NAME}</Text>
                <LinearGradient
                  colors={[colors.accentAlt, colors.pink, colors.warning]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.brandLine}
                />
              </View>
            </View>

            <Text style={styles.lead}>
              Cinco modos para cuando no hay plan… o el plan es fiesta. Un móvil, varios jugadores.
            </Text>

            <View style={styles.metaRow}>
              <View style={styles.metaPill}>
                <Text style={styles.metaPillText}>v{APP_VERSION}</Text>
              </View>
              <View style={[styles.metaPill, styles.metaPillSoft]}>
                <Text style={[styles.metaPillText, styles.metaPillTextSoft]}>Sin cuentas</Text>
              </View>
              <View style={[styles.metaPill, adsRemoved ? styles.metaPill : styles.metaPillSoft]}>
                <Text
                  style={[
                    styles.metaPillText,
                    adsRemoved ? undefined : styles.metaPillTextSoft,
                  ]}
                >
                  {adsRemoved ? 'Sin anuncios' : 'Con anuncios'}
                </Text>
              </View>
            </View>
          </FadeInBlock>

          <View style={styles.sectionHead}>
            <FadeInBlock delay={60}>
              <Text style={styles.sectionLabel}>Anuncios</Text>
            </FadeInBlock>
          </View>

          <StaggerItem index={0}>
            <View style={[styles.cardWrap, shadows.card, { shadowColor: colors.success }]}>
              <LinearGradient
                colors={[colors.success + '44', colors.success + '14', colors.card]}
                locations={[0, 0.4, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.card, { borderColor: colors.success + '55' }]}
              >
                <View style={[styles.accentBar, { backgroundColor: colors.success }]} />
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>
                    {adsRemoved ? 'Versión sin anuncios' : 'Quitar anuncios'}
                  </Text>
                  <Text style={styles.cardText}>
                    {adsRemoved
                      ? `Esta instalación ya no muestra anuncios entre rondas. Gracias por apoyar ${APP_NAME}.`
                      : `Pago único de ${productPriceLabel}. Sin suscripción: quitas los anuncios para siempre en este dispositivo.`}
                  </Text>
                  {!adsRemoved && (
                    <PrimaryButton
                      label={purchasing ? 'Espera…' : `Quitar anuncios — ${productPriceLabel}`}
                      color={colors.success}
                      onPress={() => {
                        if (!purchasing) void buyRemoveAds();
                      }}
                      style={{ alignSelf: 'stretch', marginTop: spacing.md, minWidth: 0 }}
                    />
                  )}
                  <PrimaryButton
                    label="Restaurar compras"
                    variant="ghost"
                    onPress={() => {
                      if (!purchasing) void restorePurchases();
                    }}
                    style={{ marginTop: spacing.sm }}
                  />
                </View>
              </LinearGradient>
            </View>
          </StaggerItem>

          <View style={styles.sectionHead}>
            <FadeInBlock delay={80}>
              <Text style={styles.sectionLabel}>Información</Text>
            </FadeInBlock>
          </View>

          {SECTIONS.map((section, index) => (
            <StaggerItem key={section.title} index={index + 1}>
              <InfoCard
                accent={section.accent}
                title={section.title}
                body={section.body}
                onAction={
                  section.action === 'privacy'
                    ? {
                        label: 'Política de privacidad',
                        onPress: openPrivacy,
                      }
                    : undefined
                }
              />
            </StaggerItem>
          ))}

          <Animated.View entering={FadeIn.delay(280).duration(400)} style={styles.footerWrap}>
            <Text style={styles.footer}>Hecha para quedar. Que lo paséis bien.</Text>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </ScreenShell>
  );
}

function InfoCard({
  accent,
  title,
  body,
  onAction,
}: {
  accent: string;
  title: string;
  body: string;
  onAction?: { label: string; onPress: () => void };
}) {
  return (
    <View style={[styles.cardWrap, shadows.card, { shadowColor: accent }]}>
      <LinearGradient
        colors={[accent + '44', accent + '14', colors.card]}
        locations={[0, 0.4, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { borderColor: accent + '55' }]}
      >
        <View style={[styles.accentBar, { backgroundColor: accent }]} />
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardText}>{body}</Text>
          {onAction && (
            <ActionRow
              label={onAction.label}
              accent={accent}
              onPress={onAction.onPress}
            />
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

function ActionRow({
  label,
  accent,
  onPress,
}: {
  label: string;
  accent: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 16, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      accessibilityRole="link"
      accessibilityLabel={label}
      style={[styles.actionBtn, { backgroundColor: accent + '22', borderColor: accent + '66' }, anim]}
    >
      <Text style={[styles.actionText, { color: accent }]}>{label}</Text>
      <Text style={[styles.actionChevron, { color: accent }]}>›</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.accentAlt + '66',
  },
  heroText: {
    flex: 1,
  },
  eyebrow: {
    color: colors.accentAlt,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 4,
  },
  brand: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  brandLine: {
    height: 3,
    width: 72,
    borderRadius: 3,
    marginTop: spacing.sm,
  },
  lead: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.md,
    maxWidth: 340,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.xl,
  },
  metaPill: {
    backgroundColor: colors.accentAlt + '28',
    borderColor: colors.accentAlt + '55',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.full,
  },
  metaPillSoft: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  metaPillText: {
    color: colors.accentAlt,
    fontSize: 12,
    fontWeight: '800',
  },
  metaPillTextSoft: {
    color: colors.textMuted,
  },
  sectionHead: {
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  cardWrap: {
    marginBottom: spacing.md,
    borderRadius: radii.lg,
  },
  card: {
    flexDirection: 'row',
    borderRadius: radii.lg,
    borderWidth: 1.5,
    overflow: 'hidden',
    minHeight: 96,
  },
  accentBar: {
    width: 5,
  },
  cardBody: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  cardText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  actionBtn: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radii.md,
    borderWidth: 1.5,
    minHeight: 48,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '800',
  },
  actionChevron: {
    fontSize: 22,
    fontWeight: '300',
    marginTop: -2,
  },
  footerWrap: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  footer: {
    color: colors.textDim,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
