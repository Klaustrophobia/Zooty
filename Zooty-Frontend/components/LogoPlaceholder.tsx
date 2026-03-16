import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius } from '../constants/theme';

// ─────────────────────────────────────────────────────────────────────────────
// INSTRUCCIONES PARA INTEGRAR TU LOGO SVG
// ─────────────────────────────────────────────────────────────────────────────
// 1. Instala el soporte SVG para Expo:
//      npx expo install react-native-svg
//      npm install --save-dev @svgr/webpack  (si usas Metro con transformación)
//      O bien: npx expo install react-native-svg-transformer
//
// 2. Crea/edita metro.config.js en la raíz:
//      const { getDefaultConfig } = require('expo/metro-config');
//      const config = getDefaultConfig(__dirname);
//      config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
//      config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
//      config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];
//      module.exports = config;
//
// 3. Crea/edita declarations.d.ts en la raíz:
//      declare module '*.svg' {
//        import React from 'react';
//        import { SvgProps } from 'react-native-svg';
//        const content: React.FC<SvgProps>;
//        export default content;
//      }
//
// 4. Importa y usa tu logo:
//      import ZootyLogo from '@/assets/images/logo.svg';
//
// 5. Reemplaza <LogoPlaceholder size="lg" /> por:
//      <ZootyLogo width={120} height={120} />   ← tamaño "lg"
//      <ZootyLogo width={56}  height={56}  />   ← tamaño "md"
//      <ZootyLogo width={40}  height={40}  />   ← tamaño "sm"
// ─────────────────────────────────────────────────────────────────────────────

type LogoSize = 'sm' | 'md' | 'lg';

interface LogoPlaceholderProps {
  size?: LogoSize;
}

const sizeMap: Record<LogoSize, { container: number; font: number }> = {
  sm: { container: 40, font: 16 },
  md: { container: 56, font: 20 },
  lg: { container: 120, font: 28 },
};

export default function LogoPlaceholder({ size = 'md' }: LogoPlaceholderProps) {
  const { container, font } = sizeMap[size];

  return (
    <View
      style={[
        styles.container,
        {
          width: container,
          height: container,
          borderRadius: container / 2,
        },
      ]}
    >
      {/* 👇 REEMPLAZA ESTE VIEW POR TU COMPONENTE SVG */}
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
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  letter: {
    color: Colors.primary,
    fontWeight: '800',
  },
});
