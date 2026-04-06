import { Dimensions, PixelRatio } from 'react-native';
 
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
 
// Base de diseño (iPhone 14 Pro = 393pt)
const BASE_W = 393;
const BASE_H = 852;
 
/** Escala horizontal proporcional */
export const wp = (px: number): number =>
  PixelRatio.roundToNearestPixel((px / BASE_W) * SCREEN_W);
 
/** Escala vertical proporcional */
export const hp = (px: number): number =>
  PixelRatio.roundToNearestPixel((px / BASE_H) * SCREEN_H);
 
/** Escala de fuentes (solo horizontal para no distorsionar) */
export const fp = (px: number): number =>
  PixelRatio.roundToNearestPixel((px / BASE_W) * SCREEN_W);
 
export const SCREEN_WIDTH  = SCREEN_W;
export const SCREEN_HEIGHT = SCREEN_H;