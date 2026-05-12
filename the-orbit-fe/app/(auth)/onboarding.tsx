import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientTitle } from '../../components/auth/AuthUI';

type OnboardingSlide = {
  id: string;
  image: ImageSourcePropType;
  imageRatio: number;
  imageWidthRatio: number;
  maxImageWidth: number;
  imageOffsetY?: number;
  title: string;
  bodyLines?: string[];
  primaryButtonText: string;
  secondaryButtonText?: string;
};

const BLUE = '#2F8BFF';
const PINK = '#E6A0EE';

const FINISH_ROUTE = '/login';

const slides: OnboardingSlide[] = [
  {
    id: 'center',
    image: require('../../assets/images/onboarding/bg_onboarding1.png'),
    imageRatio: 589 / 412,
    imageWidthRatio: 1.08,
    maxImageWidth: 430,
    imageOffsetY: -34,
    title: 'Find your center\nKeep your habits in orbit',
    primaryButtonText: 'Next',
  },
  {
    id: 'orbit',
    image: require('../../assets/images/onboarding/bg_onboarding2.png'),
    imageRatio: 400 / 412,
    imageWidthRatio: 1.08,
    maxImageWidth: 430,
    imageOffsetY: 0,
    title: 'You are the Center\nHabits are your Orbit',
    bodyLines: [
      "Don't let schedules constrain you.",
      'Orbit uses AI as your “gravity” to automatically organize habits around your real life.',
    ],
    primaryButtonText: 'Next',
  },
  {
    id: 'calendar',
    image: require('../../assets/images/onboarding/bg_onboarding3.png'),
    imageRatio: 1,
    imageWidthRatio: 0.42,
    maxImageWidth: 190,
    imageOffsetY: 48,
    title: 'Orbit Alignment',
    bodyLines: [
      "To keep your habits safe from 'Space time Distortions' (sudden busy events)",
      'Orbit needs to sync with your current calendar.',
    ],
    primaryButtonText: 'Connect your calendar',
    secondaryButtonText: 'Skip for now',
  },
  {
    id: 'planet',
    image: require('../../assets/images/onboarding/bg_onboarding4.png'),
    imageRatio: 388 / 334,
    imageWidthRatio: 0.86,
    maxImageWidth: 350,
    imageOffsetY: 12,
    title: 'Choose Your First Planet',
    bodyLines: [
      'Not sure where to start?',
      'Explore habit "constellations" expertly designed for you.',
    ],
    primaryButtonText: 'Next',
  },
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const { width, height } = useWindowDimensions();

  const slide = slides[index];
  const isLast = index === slides.length - 1;

  const imageSize = useMemo(() => {
    const imageWidth = Math.min(width * slide.imageWidthRatio, slide.maxImageWidth);
    const imageHeight = imageWidth * slide.imageRatio;

    return {
      width: imageWidth,
      height: imageHeight,
    };
  }, [width, slide]);

  const goNext = () => {
    if (isLast) {
      router.replace(FINISH_ROUTE);
      return;
    }

    setIndex((current) => current + 1);
  };

  const skip = () => {
    if (!isLast) {
      setIndex((current) => current + 1);
      return;
    }

    router.replace(FINISH_ROUTE);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.page}>
        <LinearGradient
          colors={['#151926', '#131722', '#11151F', '#10131B', '#0D1018', '#090B12']}
          locations={[0, 0.18, 0.38, 0.58, 0.78, 1]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        <View
          style={[
            styles.heroArea,
            {
              minHeight: height * 0.52,
            },
          ]}
        >
          <Image
            source={slide.image}
            resizeMode="contain"
            style={[
              styles.heroImage,
              {
                width: imageSize.width,
                height: imageSize.height,
                transform: [{ translateY: slide.imageOffsetY ?? 0 }],
              },
            ]}
          />
        </View>

        <View style={styles.textArea}>
          <View style={styles.titleWrap}>
            <GradientTitle size={29} lineHeight={36}>
              {slide.title}
            </GradientTitle>
          </View>

          {slide.bodyLines ? (
            <View style={styles.bodyWrap}>
              {slide.bodyLines.map((line, bodyIndex) => (
                <Text key={bodyIndex} style={styles.bodyText}>
                  {line}
                </Text>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.footer}>
          <Pressable onPress={goNext} style={styles.primaryButton}>
            <LinearGradient
              colors={[BLUE, '#6D9CFF', '#A79BFA', PINK]}
              locations={[0, 0.38, 0.7, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.primaryGradient}
            >
              <Text style={styles.primaryText}>{slide.primaryButtonText}</Text>
            </LinearGradient>
          </Pressable>

          {slide.secondaryButtonText ? (
            <Pressable onPress={skip} style={styles.secondaryButton}>
              <Text style={styles.secondaryText}>{slide.secondaryButtonText}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#10131B',
  },
  page: {
    flex: 1,
    backgroundColor: '#10131B',
    paddingHorizontal: 26,
    paddingBottom: 28,
  },

  heroArea: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  heroImage: {
    opacity: 1,
  },

  textArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  titleWrap: {
    alignItems: 'center',
  },
  bodyWrap: {
    marginTop: 32,
    alignItems: 'center',
  },
  bodyText: {
    color: 'rgba(244,247,255,0.86)',
    fontSize: 16,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 8,
    maxWidth: 330,
  },

  footer: {
    marginTop: 'auto',
    gap: 20,
  },
  primaryButton: {
    height: 56,
    borderRadius: 9,
    overflow: 'hidden',
  },
  primaryGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  secondaryButton: {
    height: 56,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(5,7,17,0.2)',
  },
  secondaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
