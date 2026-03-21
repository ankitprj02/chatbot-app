import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_FAMILY, RADII, SHADOWS, SPACING, TYPOGRAPHY } from '../theme/tokens';

// The backend API URL (e.g., your Ngrok public URL)
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

const SUGGESTED_TOPICS = [
  'Which foods cause acne?',
  'Safe snacks for sensitive skin?',
  'Best hydration routines',
  'Zinc-rich meal plan',
];

type Message = {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'assistant',
    text: 'Hello! I am your digital Food and Skin Assistant. I help you understand the relationship between what you eat and your skin health. How can I guide your glow today?',
    timestamp: '10:42 AM',
  },
  {
    id: '2',
    sender: 'user',
    text: 'I have been breaking out lately. Can you suggest some skin-friendly snacks?',
    timestamp: '10:43 AM',
  },
  {
    id: '3',
    sender: 'assistant',
    text: 'Certainly! Avoiding high-glycemic foods can help reduce inflammation. I recommend snacks rich in omega-3s and vitamin C.',
    timestamp: '',
  },
];

const TypingIndicator = () => {
  const dot1 = React.useRef(new Animated.Value(0)).current;
  const dot2 = React.useRef(new Animated.Value(0)).current;
  const dot3 = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animateDot = (dot: Animated.Value) => {
      return Animated.sequence([
        Animated.timing(dot, {
          toValue: 1,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]);
    };

    Animated.loop(
      Animated.stagger(150, [
        animateDot(dot1),
        animateDot(dot2),
        animateDot(dot3),
      ])
    ).start();
  }, [dot1, dot2, dot3]);

  const translateY1 = dot1.interpolate({ inputRange: [0, 1], outputRange: [0, -5] });
  const translateY2 = dot2.interpolate({ inputRange: [0, 1], outputRange: [0, -5] });
  const translateY3 = dot3.interpolate({ inputRange: [0, 1], outputRange: [0, -5] });

  return (
    <View style={{ flexDirection: 'row', gap: 3, alignItems: 'center', height: 24, justifyContent: 'center' }}>
      <Animated.Text style={[styles.typingDot, { transform: [{ translateY: translateY1 }] }]}>•</Animated.Text>
      <Animated.Text style={[styles.typingDot, { transform: [{ translateY: translateY2 }] }]}>•</Animated.Text>
      <Animated.Text style={[styles.typingDot, { transform: [{ translateY: translateY3 }] }]}>•</Animated.Text>
    </View>
  );
};

export function HelperCaneChatScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);
  const [messages, setMessages] = React.useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const handleSend = async (textParam?: string) => {
    const textToSend = textParam && typeof textParam === 'string' ? textParam : inputText;
    if (textToSend.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    if (!textParam || typeof textParam !== 'string') {
      setInputText('');
    }

    setIsTyping(true);
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          // user_id: 'user_123' // TODO: Pass actual user ID when Auth is implemented
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.reply;

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (error) {
      console.error('Error generating content:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: "I'm sorry, I couldn't reach the backend server. Make sure it's running and EXPO_PUBLIC_API_URL is set in your .env if you're using a physical device.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      (e) => {
        setKeyboardVisible(true);
        if (e && e.endCoordinates) {
          setKeyboardHeight(e.endCoordinates.height);
        }
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.headerWrap}>
          <BlurView intensity={80} tint="light" style={styles.headerBlur}>
            <View style={styles.headerLeft}>
              <View style={styles.avatarWrap}>
                <Image
                  source={{
                    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBT_yQqzCwqHvD56qP5lc6aifYrrrLaLBxSBPkephdxRuN4vSICCLUH841R-M2j2COOIP91F4REO8A5_AzajlWwSbzlYS_Mc63JzGt9QHY9R_PR3UcFnRBPrRxMV9E_kShlWXozxGLmIri81LrJDxA4OAi8MzuDOxLo3lLH0D6wk6e6ZPs7LUAv9nkAu1835Pmsxg9LJLoNsftYj653AJPo79-uj8m9GL5yD091EgfuXaAp-6fZ8u2o3fCQEnPDjSct4A9QEN6MCnLL',
                  }}
                  style={styles.avatar}
                />
              </View>
              <View>
                <Text style={styles.headerTitle}>Helper Cane</Text>
                <View style={styles.creditChip}>
                  <MaterialIcons name="eco" size={14} color={COLORS.secondary} />
                  <Text style={styles.creditChipText}>2 credits</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.headerAction} activeOpacity={0.85}>
              <MaterialIcons name="more-vert" size={22} color={COLORS.onSurfaceVariant} />
            </TouchableOpacity>
          </BlurView>
        </View>

        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: 24,
            },
          ]}
        >
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Today</Text>
          </View>

          {messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            const showAssistantMeta = !isUser && (index === 0 || messages[index - 1].sender !== 'assistant');

            if (isUser) {
              return (
                <View key={msg.id} style={styles.messageGroupRight}>
                  <View style={styles.userBubble}>
                    <Text style={styles.bodyTextUser}>{msg.text}</Text>
                  </View>
                  {msg.timestamp ? <Text style={styles.timestampRight}>{msg.timestamp}</Text> : null}
                </View>
              );
            }

            return (
              <View key={msg.id} style={styles.messageGroupLeft}>
                <View style={styles.assistantBubble}>
                  {showAssistantMeta && (
                    <View style={styles.assistantMeta}>
                      <MaterialIcons name="eco" size={14} color={COLORS.primary} />
                      <Text style={styles.assistantMetaLabel}>Assistant</Text>
                    </View>
                  )}
                  {msg.id === '1' ? (
                    <Text style={styles.bodyText}>
                      Hello! I am your digital <Text style={styles.bodyHighlight}>Food and Skin Assistant</Text>. I help you understand the relationship between what you eat and your skin health. How can I guide your glow today?
                    </Text>
                  ) : (
                    <Text style={styles.bodyText}>{msg.text}</Text>
                  )}
                </View>
                {msg.timestamp ? <Text style={styles.timestampLeft}>{msg.timestamp}</Text> : null}
              </View>
            );
          })}

          {isTyping && (
            <View style={styles.messageGroupLeft}>
              <View style={[styles.assistantBubble, { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.lg, alignSelf: 'flex-start' }]}>
                <TypingIndicator />
              </View>
            </View>
          )}

          <View style={styles.topicSection}>
            <Text style={styles.topicSectionLabel}>Suggested Topics</Text>
            <View style={styles.topicList}>
              {SUGGESTED_TOPICS.map((topic) => (
                <TouchableOpacity
                  key={topic}
                  style={styles.topicChip}
                  activeOpacity={0.9}
                  onPress={() => handleSend(topic)}
                >
                  <Text style={styles.topicChipText}>{topic}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View
          style={[
            styles.inputDock,
            {
              marginBottom: isKeyboardVisible 
                ? (Platform.OS === 'android' ? keyboardHeight + 16 : 16) 
                : 90,
            },
          ]}
        >
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Ask about ingredients..."
              placeholderTextColor={`${COLORS.onSurfaceVariant}AA`}
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
            />

            <TouchableOpacity onPress={() => handleSend()} style={styles.sendButton} activeOpacity={0.9}>
              <MaterialIcons name="north" size={20} color={COLORS.onPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  headerWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  headerBlur: {
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: `${COLORS.outlineVariant}30`,
    backgroundColor: `${COLORS.surfaceContainerLowest}E6`,
    overflow: 'hidden',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatarWrap: {
    width: 42,
    height: 42,
    borderRadius: RADII.full,
    overflow: 'hidden',
    backgroundColor: COLORS.primaryContainer,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    ...TYPOGRAPHY.titleMd,
    color: COLORS.onSurface,
  },
  creditChip: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${COLORS.secondaryContainer}90`,
    borderRadius: RADII.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  creditChipText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: COLORS.onSecondaryContainer,
  },
  headerAction: {
    width: 38,
    height: 38,
    borderRadius: RADII.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingTop: 108,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  dateRow: {
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  dateLabel: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.onSurfaceVariant,
    backgroundColor: COLORS.surfaceContainer,
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
    borderRadius: RADII.full,
    opacity: 0.75,
  },
  messageGroupLeft: {
    alignItems: 'flex-start',
    maxWidth: '88%',
    gap: 6,
  },
  messageGroupRight: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    maxWidth: '88%',
    gap: 6,
  },
  assistantBubble: {
    backgroundColor: COLORS.surfaceContainerHighest,
    borderRadius: RADII.md,
    borderBottomLeftRadius: RADII.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    ...SHADOWS.ambient,
  },
  assistantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  assistantMetaLabel: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: COLORS.onSurfaceVariant,
  },
  userBubble: {
    backgroundColor: COLORS.primaryContainer,
    borderRadius: RADII.md,
    borderBottomRightRadius: RADII.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    ...SHADOWS.ambient,
  },
  bodyText: {
    ...TYPOGRAPHY.bodyLg,
    color: COLORS.onSurface,
  },
  bodyTextUser: {
    ...TYPOGRAPHY.bodyLg,
    color: COLORS.onPrimaryContainer,
  },
  bodyHighlight: {
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.primary,
  },
  timestampLeft: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 11,
    color: `${COLORS.onSurfaceVariant}99`,
    marginLeft: 8,
  },
  timestampRight: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 11,
    color: `${COLORS.onSurfaceVariant}99`,
    marginRight: 8,
  },
  typingDot: {
    fontSize: 28,
    lineHeight: 28,
    color: COLORS.primary,
  },
  topicSection: {
    marginTop: SPACING.xl,
    gap: SPACING.sm,
  },
  topicSectionLabel: {
    marginLeft: 4,
    fontFamily: FONT_FAMILY.bold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: COLORS.onSurfaceVariant,
  },
  topicList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  topicChip: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: RADII.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: `${COLORS.outlineVariant}26`,
    ...SHADOWS.ambient,
  },
  topicChipText: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.onSurface,
  },
  inputDock: {
    marginHorizontal: SPACING.lg,
    zIndex: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLowest,
    padding: 6,
    borderRadius: RADII.full,
    borderWidth: 1,
    borderColor: `${COLORS.outlineVariant}26`,
    ...SHADOWS.ambient,
  },
  textInput: {
    flex: 1,
    ...TYPOGRAPHY.bodyLg,
    color: COLORS.onSurface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: RADII.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    ...SHADOWS.lifted,
  },
});
