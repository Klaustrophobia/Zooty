import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';
import { wp } from '../constants/Responsive';

// ─────────────────────────────────────────────────────────────────────────────
// INSTRUCCIONES PARA INTEGRAR TU LOGO SVG
// ─────────────────────────────────────────────────────────────────────────────
// 1. Instala soporte SVG para Expo:
//      npx expo install react-native-svg
//      npm install --save-dev react-native-svg-transformer
//
// 2. Crea/edita metro.config.js en la raíz:
//      const { getDefaultConfig } = require('expo/metro-config');
//      const config = getDefaultConfig(__dirname);
//      config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
//      config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
//      config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];
//      module.exports = config;
//
// 3. Crea declarations.d.ts en la raíz:
//      declare module '*.svg' {
//        import React from 'react';
//        import { SvgProps } from 'react-native-svg';
//        const content: React.FC<SvgProps>;
//        export default content;
//      }
//
// 4. Importa y reemplaza:
//      import ZootyLogo from '@/assets/images/logo.svg';
//      <ZootyLogo width={sizeMap[size]} height={sizeMap[size]} />
// ─────────────────────────────────────────────────────────────────────────────

type LogoSize = 'sm' | 'md' | 'lg';

interface LogoPlaceholderProps {
  size?: LogoSize;
}

// Tamaños en puntos de diseño base → wp() los escala
const sizeMap: Record<LogoSize, number> = {
  sm: wp(40),
  md: wp(56),
  lg: wp(120),
};

const fontMap: Record<LogoSize, number> = {
  sm: wp(16),
  md: wp(20),
  lg: wp(32),
};

export default function LogoPlaceholder({ size = 'md' }: LogoPlaceholderProps) {
  const dim  = sizeMap[size];
  const font = fontMap[size];

  return (
    <View style={[styles.container, { width: dim, height: dim, borderRadius: dim / 2 }]}>
      {/* 👇 REEMPLAZA POR: <ZootyLogo width={dim} height={dim} /> */}
      <Text style={[styles.letter, { fontSize: font }]}>Z</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: wp(10),
    shadowOffset: { width: 0, height: wp(3) },
    elevation: 3,
  },
  letter: {
    color: Colors.primary,
    fontWeight: '800',
  },
});