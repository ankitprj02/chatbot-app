import { MaterialIcons } from '@expo/vector-icons';
import {
  NavigationContainer,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AuthScreen } from '../screens/AuthScreen';
import { HelperCaneChatScreen } from '../screens/HelperCaneChatScreen';
import { UpgradeToProScreen } from '../screens/UpgradeToProScreen';
import { UserProfileScreen } from '../screens/UserProfileScreen';
import { navigationTheme } from '../theme/navigationTheme';
import { COLORS, FONT_FAMILY, RADII, SHADOWS } from '../theme/tokens';
import { MainTabParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ routeName, focused }: { routeName: keyof MainTabParamList; focused: boolean }) {
  const iconName = routeName === 'Chat' ? 'chat-bubble' : 'person';

  return (
    <View style={{ marginBottom: 2 }}>
      <MaterialIcons
        name={iconName}
        size={20}
        color={focused ? COLORS.onPrimaryContainer : COLORS.onSurfaceVariant}
      />
    </View>
  );
}

function getTabLabel(route: RouteProp<ParamListBase, string>) {
  return route.name === 'Chat' ? 'Chat' : 'Profile';
}

function MainTabsNavigator() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: COLORS.onPrimaryContainer,
        tabBarInactiveTintColor: COLORS.onSurfaceVariant,
        tabBarItemStyle: {
          borderRadius: RADII.full,
          marginHorizontal: 6,
          marginVertical: 7,
        },
        tabBarActiveBackgroundColor: COLORS.primaryContainer,
        tabBarStyle: {
          position: 'absolute',
          left: 14,
          right: 14,
          bottom: 14,
          borderRadius: RADII.lg,
          height: 74,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          ...SHADOWS.ambient,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={30}
            tint="light"
            style={{
              flex: 1,
              borderRadius: RADII.lg,
              borderWidth: 1,
              borderColor: `${COLORS.outlineVariant}35`,
              backgroundColor: `${COLORS.surfaceContainerLowest}D8`,
            }}
          />
        ),
        tabBarLabel: ({ focused, color }) => (
          <Text
            style={{
              fontFamily: focused ? FONT_FAMILY.bold : FONT_FAMILY.semiBold,
              fontSize: 12,
              color,
              marginBottom: 4,
            }}
          >
            {getTabLabel(route as RouteProp<ParamListBase, string>)}
          </Text>
        ),
        tabBarIcon: ({ focused }) => (
          <TabIcon routeName={route.name as keyof MainTabParamList} focused={focused} />
        ),
      })}
    >
      <Tabs.Screen name="Chat" component={HelperCaneChatScreen} />
      <Tabs.Screen name="Profile" component={UserProfileScreen} />
    </Tabs.Navigator>
  );
}

export function RootNavigator() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.surface }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
            <Stack.Screen
              name="UpgradeToPro"
              component={UpgradeToProScreen}
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
