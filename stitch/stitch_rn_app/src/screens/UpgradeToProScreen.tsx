import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Purchases from 'react-native-purchases';
import { RootStackParamList } from '../navigation/types';
import { COLORS, FONT_FAMILY, RADII, SHADOWS, SPACING, TYPOGRAPHY } from '../theme/tokens';

type PlanType = 'yearly' | 'weekly';

type Feature = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
  fullWidth?: boolean;
};

const FEATURES: Feature[] = [
  {
    icon: 'chat-bubble-outline',
    title: 'Unlimited Chats',
    description: 'No daily limits on botanical inquiries or AI companionship.',
  },
  {
    icon: 'psychology',
    title: 'Advanced AI Analysis',
    description: 'Access our most sophisticated botanical logic engine.',
  },
  {
    icon: 'support-agent',
    title: 'Priority Support',
    description: 'Get your questions answered by experts with faster response times.',
    fullWidth: true,
  },
];

const PLANS = {
  yearly: {
    title: 'Yearly - $49.99/year (Best Value)',
    subtitle: 'Less than $4.20 per month',
    badge: 'Most Popular',
  },
  weekly: {
    title: 'Weekly - $4.99/week',
    subtitle: 'Flexible botanical guidance',
  },
} as const;

export function UpgradeToProScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const offerings = await Purchases.getOfferings();
      const current = offerings.current;
      if (current) {
        const packageToBuy = selectedPlan === 'yearly' ? current.annual : current.weekly;
        if (packageToBuy) {
          await Purchases.purchasePackage(packageToBuy);
          Alert.alert('Success!', 'Your subscription has been activated.');
          navigation.goBack();
        } else {
          Alert.alert('Not available', 'This package is not configured yet.');
        }
      } else {
        Alert.alert('Configuration Error', 'No offerings configured in RevenueCat.');
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert('Error', e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      await Purchases.restorePurchases();
      Alert.alert('Success', 'Purchases restored successfully.');
    } catch (e: any) {
      Alert.alert('Error restoring purchases', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.screen}>
        <View style={styles.decorOrbLeft} />
        <View style={styles.decorOrbRight} />

        <View style={styles.topNav}>
          <View style={styles.brandWrap}>
            <MaterialIcons name="eco" size={24} color={COLORS.primary} />
            <Text style={styles.brandTitle}>The Botanical Intelligence</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={navigation.goBack} activeOpacity={0.85}>
            <MaterialIcons name="close" size={22} color={COLORS.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.heroSection}>
            <View style={styles.premiumBadge}>
              <MaterialIcons name="auto-awesome" size={16} color={COLORS.onPrimaryContainer} />
              <Text style={styles.premiumBadgeText}>PREMIUM EXPERIENCE</Text>
            </View>
            <Text style={styles.heroTitle}>Unlock Your Full Potential with Sugarcane Pro</Text>
            <Text style={styles.heroSubtitle}>
              Elevate your daily insights with botanical wisdom powered by advanced AI.
            </Text>
          </View>

          <View style={styles.featureGrid}>
            {FEATURES.map((feature) => (
              <View
                key={feature.title}
                style={[styles.featureCard, feature.fullWidth ? styles.featureCardFullWidth : styles.featureCardHalf]}
              >
                <View style={styles.featureIconWrap}>
                  <MaterialIcons name={feature.icon} size={22} color={COLORS.primary} />
                </View>
                <View style={styles.featureCopy}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.pricingSection}>
            <Pressable style={styles.selectedPlanWrap} onPress={() => setSelectedPlan('yearly')}>
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>{PLANS.yearly.badge}</Text>
              </View>
              <View
                style={[
                  styles.planCard,
                  selectedPlan === 'yearly' ? styles.planCardSelected : styles.planCardUnselected,
                ]}
              >
                <View style={styles.radioRow}>
                  <View style={[styles.radioOuter, selectedPlan === 'yearly' ? styles.radioOuterSelected : undefined]}>
                    {selectedPlan === 'yearly' ? <View style={styles.radioInner} /> : null}
                  </View>
                  <View style={styles.planCopy}>
                    <Text style={styles.planTitle}>{PLANS.yearly.title}</Text>
                    <Text style={styles.planSubtitle}>{PLANS.yearly.subtitle}</Text>
                  </View>
                </View>
              </View>
            </Pressable>

            <Pressable onPress={() => setSelectedPlan('weekly')}>
              <View
                style={[
                  styles.planCard,
                  selectedPlan === 'weekly' ? styles.planCardSelected : styles.planCardMuted,
                ]}
              >
                <View style={styles.radioRow}>
                  <View style={[styles.radioOuter, selectedPlan === 'weekly' ? styles.radioOuterSelected : undefined]}>
                    {selectedPlan === 'weekly' ? <View style={styles.radioInner} /> : null}
                  </View>
                  <View style={styles.planCopy}>
                    <Text style={styles.planTitle}>{PLANS.weekly.title}</Text>
                    <Text style={styles.planSubtitle}>{PLANS.weekly.subtitle}</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          </View>

          <TouchableOpacity activeOpacity={0.93} onPress={handlePurchase} disabled={loading}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaButton}
            >
              <Text style={styles.ctaText}>{loading ? 'Processing...' : 'Subscribe Now'}</Text>
              {!loading && <MaterialIcons name="chevron-right" size={20} color={COLORS.onPrimary} />}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity activeOpacity={0.8} onPress={handleRestore} disabled={loading}>
              <Text style={styles.restoreText}>Restore Purchases</Text>
            </TouchableOpacity>

            <View style={styles.footerLinks}>
              <TouchableOpacity>
                <Text style={styles.footerLinkText}>Terms of Service</Text>
              </TouchableOpacity>
              <View style={styles.footerDot} />
              <TouchableOpacity>
                <Text style={styles.footerLinkText}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.disclaimer}>
              By subscribing, you agree to our Terms. Subscription renews automatically unless cancelled 24 hours before
              the end of your period.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  screen: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  decorOrbLeft: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: RADII.full,
    backgroundColor: `${COLORS.primaryContainer}55`,
    bottom: -130,
    left: -120,
    zIndex: 0,
  },
  decorOrbRight: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: RADII.full,
    backgroundColor: `${COLORS.secondaryContainer}55`,
    top: -120,
    right: -110,
    zIndex: 0,
  },
  topNav: {
    zIndex: 3,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  brandTitle: {
    ...TYPOGRAPHY.titleMd,
    color: COLORS.onSurface,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: RADII.full,
    backgroundColor: `${COLORS.surfaceContainerLow}DD`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    zIndex: 2,
  },
  heroSection: {
    marginTop: SPACING.sm,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: RADII.full,
    backgroundColor: COLORS.primaryContainer,
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    marginBottom: SPACING.lg,
  },
  premiumBadgeText: {
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.onPrimaryContainer,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  heroTitle: {
    ...TYPOGRAPHY.displayMd,
    color: COLORS.onSurface,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...TYPOGRAPHY.bodyLg,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    marginTop: SPACING.sm,
    maxWidth: 320,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  featureCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADII.md,
    padding: SPACING.md,
    gap: SPACING.sm,
    minHeight: 150,
  },
  featureCardHalf: {
    width: '48.3%',
  },
  featureCardFullWidth: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 118,
  },
  featureIconWrap: {
    width: 46,
    height: 46,
    borderRadius: RADII.full,
    backgroundColor: COLORS.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.ambient,
  },
  featureCopy: {
    flexShrink: 1,
    gap: 2,
  },
  featureTitle: {
    ...TYPOGRAPHY.titleMd,
    color: COLORS.onSurface,
  },
  featureDescription: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.onSurfaceVariant,
  },
  pricingSection: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  selectedPlanWrap: {
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: SPACING.md,
    zIndex: 2,
    borderRadius: RADII.full,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  popularBadgeText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 10,
    letterSpacing: 0.9,
    color: COLORS.onSecondary,
    textTransform: 'uppercase',
  },
  planCard: {
    borderRadius: RADII.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  planCardSelected: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...SHADOWS.ambient,
  },
  planCardUnselected: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  planCardMuted: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderWidth: 0,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: RADII.full,
    borderWidth: 2,
    borderColor: `${COLORS.outlineVariant}90`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: RADII.full,
    backgroundColor: COLORS.primary,
  },
  planCopy: {
    flexShrink: 1,
  },
  planTitle: {
    ...TYPOGRAPHY.titleMd,
    color: COLORS.onSurface,
  },
  planSubtitle: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  ctaButton: {
    borderRadius: RADII.md,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    ...SHADOWS.lifted,
  },
  ctaText: {
    ...TYPOGRAPHY.titleMd,
    color: COLORS.onPrimary,
  },
  footer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.md,
  },
  restoreText: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.onSurfaceVariant,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  footerLinkText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 12,
    color: COLORS.outline,
  },
  footerDot: {
    width: 4,
    height: 4,
    borderRadius: RADII.full,
    backgroundColor: COLORS.outlineVariant,
  },
  disclaimer: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.outlineVariant,
    textAlign: 'center',
    maxWidth: 310,
  },
});
