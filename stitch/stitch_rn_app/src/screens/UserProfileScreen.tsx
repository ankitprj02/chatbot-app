import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { supabase } from '../lib/supabase';
import { COLORS, FONT_FAMILY, RADII, SHADOWS, SPACING, TYPOGRAPHY } from '../theme/tokens';

type SettingItem = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  badge?: {
    text: string;
    tone: 'success' | 'muted';
  };
};

const PERSONALIZATION_ITEMS: SettingItem[] = [
  {
    icon: 'face',
    title: 'Skin and Hair Profile',
    badge: {
      text: 'Completed',
      tone: 'success',
    },
  },
  {
    icon: 'self-improvement',
    title: 'Skincare Routine',
    badge: {
      text: 'Completed',
      tone: 'success',
    },
  },
  {
    icon: 'rate-review',
    title: 'My Reviews',
    badge: {
      text: '12 Reviews',
      tone: 'muted',
    },
  },
];

const ACCOUNT_ITEMS: SettingItem[] = [
  {
    icon: 'manage-accounts',
    title: 'Manage Account',
  },
  {
    icon: 'verified-user',
    title: 'Privacy Policy',
  },
  {
    icon: 'description',
    title: 'Terms of Service',
  },
];

export function UserProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const tabBarHeight = useBottomTabBarHeight();
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email || 'Guest');
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        <View style={styles.headerWrap}>
          <BlurView intensity={80} tint="light" style={styles.headerBlur}>
            <View style={styles.headerLeft}>
              <View style={styles.headerAvatarWrap}>
                <Image
                  source={{
                    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGF8Irpy728IFfmokyHNeK9cYagkiykNNRQZw2txOLezqNq9rUIrL_cI__7qI4BseY8WGRnJguVy7sxiN8sGfKze248fZUIbpU39QPxAg5zemPeaAmfvfgRONde9t4G4TONp7ePILW7Q6l4vq8wi9nOmG1LdDcqE-KjsPkxJixesxnmqeB6zGqv6ml94giV-vu6erqfdROTKQlAiF1_O5s6UaJs_7wM_BrFjmTfOexE-TwR8KWgBBnk98Pdl31cr-qYNHNxgWVTLcc',
                  }}
                  style={styles.headerAvatar}
                />
              </View>
              <Text style={styles.brandText}>The Botanical Intelligence</Text>
            </View>

            <TouchableOpacity style={styles.leafButton} activeOpacity={0.85}>
              <MaterialIcons name="eco" size={21} color={COLORS.surfaceTint} />
            </TouchableOpacity>
          </BlurView>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom: 130,
            },
          ]}
        >
          <View style={styles.profileSection}>
            <View style={styles.avatarFrame}>
              <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.avatarGradient}>
                <View style={styles.avatarInnerWrap}>
                  <Image
                    source={{
                      uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPr_UNDjELxKLecAJkmRMRFBKkU5LxgzAkhn0vhbaYW5d-QjEElRmPOxGv1r1Qcnnnd7og-A29toIgObVwTr5B8abpATT52L9hFcusp-89gs9SVukNHrp4DAEM7udXwE3ui98dDUMyOnjgjNBVamcVjJ-P1vXGmozrYDT7vkAvE2_PXyMBHyPac6rMaQrVN4mGhbHp_g8KmmAWb1cNGGq9fYiERBM3r58--61_Ot9MondSPTzomEnZM_qaFgCTp045aOZTpx6JeYnF',
                    }}
                    style={styles.profileAvatar}
                  />
                </View>
              </LinearGradient>

              <TouchableOpacity style={styles.editIconWrap} activeOpacity={0.9}>
                <MaterialIcons name="edit" size={16} color={COLORS.onPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.profileName}>{userEmail || 'Loading...'}</Text>
            <Text style={styles.profileSubtitle}>Botanical Enthusiast • Level 4</Text>
          </View>

          <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.premiumCard}>
            <View style={styles.premiumGhostIcon}>
              <MaterialIcons name="eco" size={88} color={`${COLORS.onPrimary}22`} />
            </View>

            <View style={styles.premiumCardContent}>
              <Text style={styles.premiumTitle}>Try Sugarcane Pro for free!</Text>
              <Text style={styles.premiumSubtitle}>
                Unlock advanced AI analysis and personalized growth cycles.
              </Text>
              <TouchableOpacity
                style={styles.premiumButton}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('UpgradeToPro')}
              >
                <Text style={styles.premiumButtonText}>Upgrade Now</Text>
                <MaterialIcons name="star" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View style={styles.sectionGroup}>
            <Text style={styles.sectionLabel}>Personalization</Text>
            <View style={styles.sectionCard}>
              {PERSONALIZATION_ITEMS.map((item) => (
                <TouchableOpacity key={item.title} style={styles.settingRow} activeOpacity={0.86}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIconWrap}>
                      <MaterialIcons name={item.icon} size={20} color={COLORS.primary} />
                    </View>
                    <Text style={styles.settingLabel}>{item.title}</Text>
                  </View>

                  <View style={styles.settingRight}>
                    {item.badge ? (
                      <View
                        style={[
                          styles.badge,
                          item.badge.tone === 'success' ? styles.badgeSuccess : styles.badgeMuted,
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeText,
                            item.badge.tone === 'success' ? styles.badgeTextSuccess : styles.badgeTextMuted,
                          ]}
                        >
                          {item.badge.text}
                        </Text>
                      </View>
                    ) : null}
                    <MaterialIcons name="chevron-right" size={20} color={`${COLORS.onSurfaceVariant}8A`} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.sectionGroup}>
            <Text style={styles.sectionLabel}>Account and Legal</Text>
            <View style={styles.sectionCard}>
              {ACCOUNT_ITEMS.map((item) => (
                <TouchableOpacity key={item.title} style={styles.settingRow} activeOpacity={0.86}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIconWrap}>
                      <MaterialIcons name={item.icon} size={20} color={COLORS.primary} />
                    </View>
                    <Text style={styles.settingLabel}>{item.title}</Text>
                  </View>

                  <MaterialIcons name="chevron-right" size={20} color={`${COLORS.onSurfaceVariant}8A`} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.86} onPress={() => supabase.auth.signOut()}>
            <MaterialIcons name="logout" size={20} color={COLORS.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
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
  headerWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  headerBlur: {
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: `${COLORS.outlineVariant}33`,
    backgroundColor: `${COLORS.surfaceContainerLowest}E6`,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  headerAvatarWrap: {
    width: 38,
    height: 38,
    borderRadius: RADII.full,
    overflow: 'hidden',
    backgroundColor: COLORS.primaryContainer,
  },
  headerAvatar: {
    width: '100%',
    height: '100%',
  },
  brandText: {
    ...TYPOGRAPHY.titleMd,
    color: COLORS.onSurface,
    flexShrink: 1,
  },
  leafButton: {
    width: 36,
    height: 36,
    borderRadius: RADII.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${COLORS.surfaceContainerLow}CC`,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 102,
    gap: SPACING.xl,
  },
  profileSection: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatarFrame: {
    position: 'relative',
  },
  avatarGradient: {
    width: 132,
    height: 132,
    borderRadius: RADII.md,
    padding: 4,
  },
  avatarInnerWrap: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: COLORS.surface,
    overflow: 'hidden',
  },
  profileAvatar: {
    width: '100%',
    height: '100%',
  },
  editIconWrap: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 34,
    height: 34,
    borderRadius: RADII.full,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
    ...SHADOWS.ambient,
  },
  profileName: {
    ...TYPOGRAPHY.headlineSm,
    color: COLORS.onSurface,
    textAlign: 'center',
  },
  profileSubtitle: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
  },
  premiumCard: {
    borderRadius: RADII.md,
    padding: SPACING.lg,
    overflow: 'hidden',
    ...SHADOWS.lifted,
  },
  premiumGhostIcon: {
    position: 'absolute',
    top: -14,
    right: -4,
  },
  premiumCardContent: {
    width: '72%',
    gap: SPACING.md,
  },
  premiumTitle: {
    ...TYPOGRAPHY.headlineSm,
    color: COLORS.onPrimary,
  },
  premiumSubtitle: {
    ...TYPOGRAPHY.labelMd,
    color: `${COLORS.onPrimary}D6`,
  },
  premiumButton: {
    backgroundColor: COLORS.surfaceContainerLowest,
    alignSelf: 'flex-start',
    borderRadius: RADII.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    ...SHADOWS.ambient,
  },
  premiumButtonText: {
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.primary,
    fontSize: 13,
  },
  sectionGroup: {
    gap: SPACING.sm,
  },
  sectionLabel: {
    marginLeft: 4,
    fontFamily: FONT_FAMILY.bold,
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionCard: {
    borderRadius: RADII.md,
    backgroundColor: COLORS.surfaceContainerLow,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flexShrink: 1,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  settingIconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADII.full,
    backgroundColor: COLORS.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.ambient,
  },
  settingLabel: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.onSurface,
    flexShrink: 1,
  },
  badge: {
    borderRadius: RADII.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeSuccess: {
    backgroundColor: COLORS.primaryContainer,
  },
  badgeMuted: {
    backgroundColor: COLORS.surfaceVariant,
  },
  badgeText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 10,
  },
  badgeTextSuccess: {
    color: COLORS.primary,
  },
  badgeTextMuted: {
    color: COLORS.onSurfaceVariant,
  },
  logoutButton: {
    borderRadius: RADII.md,
    backgroundColor: `${COLORS.errorContainer}20`,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  logoutText: {
    ...TYPOGRAPHY.titleMd,
    color: COLORS.error,
  },
});
