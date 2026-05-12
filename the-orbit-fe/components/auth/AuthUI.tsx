import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/theme';

const AUTH_BG = '#10131B';
const BLUE = colors.primary;
const MID = '#7D8DFF';
const PINK = colors.pink;
const GOOGLE_LOGO = require('../../assets/images/login/logo_google.png');
const webInputStyle =
  Platform.OS === 'web'
    ? ({
        backgroundColor: 'transparent',
        outlineColor: 'transparent',
        outlineStyle: 'none',
        WebkitAppearance: 'none',
      } as never)
    : null;

function flattenText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(flattenText).join('');
  }

  return '';
}

function interpolateColor(start: string, end: string, progress: number) {
  const startValue = parseInt(start.slice(1), 16);
  const endValue = parseInt(end.slice(1), 16);
  const startRgb = [(startValue >> 16) & 255, (startValue >> 8) & 255, startValue & 255];
  const endRgb = [(endValue >> 16) & 255, (endValue >> 8) & 255, endValue & 255];
  const rgb = startRgb.map((value, index) =>
    Math.round(value + (endRgb[index] - value) * progress)
  );

  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function titleColorAt(index: number, total: number) {
  const progress = total <= 1 ? 0 : index / (total - 1);

  if (progress <= 0.58) {
    return interpolateColor(BLUE, MID, progress / 0.58);
  }

  return interpolateColor(MID, PINK, (progress - 0.58) / 0.42);
}

export function AuthScreen({
  children,
  contentStyle,
}: {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#12151F', '#10131B', '#0D1018', '#090B12']}
        locations={[0, 0.42, 0.74, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function GradientTitle({
  children,
  size = 42,
  lineHeight,
}: {
  children: ReactNode;
  size?: number;
  lineHeight?: number;
}) {
  const titleStyle = [
    styles.gradientTitleMask,
    {
      fontSize: size,
      lineHeight: lineHeight ?? size + 8,
    },
  ];

  if (Platform.OS === 'web') {
    const title = flattenText(children);
    const visibleLength = Array.from(title).filter((char) => char !== '\n').length;
    let visibleIndex = 0;

    return (
      <Text style={titleStyle}>
        {Array.from(title).map((char, index) => {
          if (char === '\n') {
            return '\n';
          }

          const color = titleColorAt(visibleIndex, visibleLength);
          visibleIndex += 1;

          return (
            <Text key={`${char}-${index}`} style={{ color }}>
              {char}
            </Text>
          );
        })}
      </Text>
    );
  }

  return (
    <MaskedView
      maskElement={
        <Text style={titleStyle}>{children}</Text>
      }
    >
      <LinearGradient colors={[BLUE, MID, PINK]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}>
        <Text style={[titleStyle, styles.hiddenGradientTitle]}>
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}

type AuthInputProps = TextInputProps & {
  label: string;
  password?: boolean;
};

export function AuthInput({ label, password = false, ...props }: AuthInputProps) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const { onBlur, onFocus, ...inputProps } = props;

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>

      <View style={[styles.inputBox, focused && styles.inputBoxFocused]}>
        <TextInput
          {...inputProps}
          secureTextEntry={password && !visible}
          placeholderTextColor="rgba(244,247,255,0.45)"
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          style={[styles.input, webInputStyle]}
        />

        {password ? (
          <Pressable hitSlop={10} onPress={() => setVisible((current) => !current)}>
            <Ionicons
              name={visible ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="rgba(244,247,255,0.58)"
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export function GradientButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.gradientButton, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={[BLUE, MID, '#E3A0ED']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradientButtonInner}
      >
        <Text style={styles.gradientButtonText}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

export function AuthButton({ title, onPress }: { title: string; onPress: () => void }) {
  return <GradientButton title={title} onPress={onPress} />;
}

export function OutlineButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}
    >
      <Text style={styles.outlineButtonText}>{title}</Text>
    </Pressable>
  );
}

export function AuthDivider() {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.divider} />
      <Text style={styles.dividerText}>Or Login with</Text>
      <View style={styles.divider} />
    </View>
  );
}

export function GoogleButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.googleButton, pressed && styles.pressed]}
    >
      <Image source={GOOGLE_LOGO} resizeMode="contain" style={styles.googleIcon} />
    </Pressable>
  );
}

export function AuthLinkRow({
  text,
  linkText,
  onPress,
}: {
  text: string;
  linkText: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.linkRow}>
      <Text style={styles.linkNormal}>{text}</Text>

      <Pressable onPress={onPress}>
        <Text style={styles.linkText}> {linkText}</Text>
      </Pressable>
    </View>
  );
}

export function CheckRow({
  checked,
  onPress,
  text,
}: {
  checked: boolean;
  onPress: () => void;
  text: string;
}) {
  return (
    <Pressable onPress={onPress} style={styles.checkRow}>
      <View style={[styles.checkCircle, checked && styles.checkCircleActive]}>
        {checked ? <Ionicons name="checkmark" size={13} color="#FFFFFF" /> : null}
      </View>

      <Text style={styles.checkText}>{text}</Text>
    </Pressable>
  );
}

export function OtpInput({
  value,
  onChange,
  length = 6,
}: {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}) {
  const inputRef = useRef<TextInput>(null);

  return (
    <Pressable onPress={() => inputRef.current?.focus()} style={styles.otpWrap}>
      {Array.from({ length }).map((_, index) => (
        <View key={index} style={styles.otpBox}>
          <Text style={styles.otpText}>{value[index] ?? ''}</Text>
        </View>
      ))}

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        maxLength={length}
        style={styles.hiddenOtpInput}
        autoFocus
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: AUTH_BG,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 36,
    paddingBottom: 36,
  },

  gradientTitleMask: {
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0,
  },
  hiddenGradientTitle: {
    opacity: 0,
  },

  inputGroup: {
    marginBottom: 40,
  },
  inputLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  inputBox: {
    height: 56,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: BLUE,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AUTH_BG,
  },
  inputBoxFocused: {
    borderColor: '#58A7FF',
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 0,
  },

  gradientButton: {
    height: 56,
    borderRadius: 9,
    overflow: 'hidden',
  },
  gradientButtonInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.86,
  },

  outlineButton: {
    height: 56,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AUTH_BG,
  },
  outlineButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  dividerRow: {
    marginTop: 62,
    marginBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(244,247,255,0.78)',
  },
  dividerText: {
    color: 'rgba(244,247,255,0.62)',
    fontSize: 14,
    fontWeight: '500',
  },

  googleButton: {
    height: 56,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AUTH_BG,
  },
  googleIcon: {
    width: 88,
    height: 22,
  },

  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkNormal: {
    color: 'rgba(244,247,255,0.62)',
    fontSize: 14,
    fontWeight: '500',
  },
  linkText: {
    color: BLUE,
    fontSize: 14,
    fontWeight: '800',
  },

  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(47,139,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  checkCircleActive: {
    backgroundColor: BLUE,
  },
  checkText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },

  otpWrap: {
    marginTop: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpBox: {
    width: 42,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  hiddenOtpInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
});
