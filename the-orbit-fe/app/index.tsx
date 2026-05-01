import { Redirect } from 'expo-router';

export default function Index() {
  const isLoggedIn = false;
  const hasSeenOnboarding = false;

  if (!hasSeenOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
