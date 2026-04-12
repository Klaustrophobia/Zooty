import React from 'react';
import { StyleSheet, ViewStyle, StyleProp, View } from 'react-native';
import { Image } from 'expo-image';
import { wp, SCREEN_WIDTH } from '@/constants/Responsive';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' | 'full';

interface LogoProps {
  size?: LogoSize;
  style?: StyleProp<ViewStyle>;
}

// Tamaños responsivos basados en porcentajes del ancho de pantalla
const sizeMap: Record<LogoSize, number> = {
  sm: wp(60),                    // ~15% en iPhone 14 Pro
  md: wp(100),                   // ~25% en iPhone 14 Pro
  lg: wp(150),                   // ~38% en iPhone 14 Pro
  xl: wp(200),                   // ~51% en iPhone 14 Pro
  xxl: wp(260),                  // ~66% en iPhone 14 Pro
  xxxl: SCREEN_WIDTH * 0.75,     // 75% del ancho de pantalla
  full: SCREEN_WIDTH * 0.85,     // 85% del ancho de pantalla (con márgenes)
};

export default function Logo({ size = 'md', style }: LogoProps) {
  const dim = sizeMap[size];

  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('@/assets/images/ZootyLogo.svg')}
        style={{
          width: dim,
          height: dim,
          backgroundColor: 'transparent',
        }}
        contentFit="contain"
        transition={200}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});