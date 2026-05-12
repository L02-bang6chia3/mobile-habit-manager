import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthScreen, GradientButton, GradientTitle, OtpInput } from '../../components/auth/AuthUI';
import { colors } from '../../constants/theme';

export default function OtpScreen() {
  const [otp, setOtp] = useState('');

  return (
    <AuthScreen contentStyle={styles.screen}>
      <View style={styles.titleWrap}>
        <GradientTitle size={40} lineHeight={52}>
          Please check{'\n'}your email
        </GradientTitle>
      </View>

      <Text style={styles.description}>
        We’ve sent a code to <Text style={styles.email}>helloworld@gmail.com</Text>
      </Text>

      <OtpInput value={otp} onChange={setOtp} />

      <View style={styles.buttonWrap}>
        <GradientButton title="Send code" onPress={() => router.replace('/login')} />
      </View>

      <View style={styles.resendWrap}>
        <Text style={styles.resendText}>
          <Text style={styles.resendBold}>Send code again</Text> 00:20
        </Text>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 64,
  },
  titleWrap: {
    alignItems: 'center',
    marginBottom: 50,
  },
  description: {
    color: 'rgba(244,247,255,0.72)',
    fontSize: 14,
    lineHeight: 20,
  },
  email: {
    color: colors.text,
    fontWeight: '700',
  },
  buttonWrap: {
    marginTop: 50,
  },
  resendWrap: {
    marginTop: 52,
    alignItems: 'center',
  },
  resendText: {
    color: 'rgba(244,247,255,0.65)',
    fontSize: 16,
  },
  resendBold: {
    color: 'rgba(244,247,255,0.72)',
    fontWeight: '800',
  },
});
