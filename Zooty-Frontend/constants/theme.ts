import { wp, hp, fp } from './Responsive';

export const Colors = {
  primary:            '#3DBFAD',
  primaryLight:       '#E8F7F5',
  secondary:          '#F4845F',
  white:              '#FFFFFF',
  background:         '#F5FBFA',
  inputBg:            '#FDF1EF',
  inputBorder:        '#F5C9C0',
  textDark:           '#1A2E35',
  textMedium:         '#4A6572',
  textLight:          '#8FA8B2',
  placeholder:        '#BCCDD3',
  stepDone:           '#3DBFAD',
  stepPending:        '#D8EEEB',
  borderLight:        '#E0EEF0',
  tagBorder:          '#D8EEEB',
  verificationBg:     '#F0FAF8',
  verificationBorder: '#C5E9E3',
  mapBg:              '#E8F0EE',
  error:              '#E05C5C',
} as const;

export const Spacing = {
  xs:  wp(4),
  sm:  wp(8),
  md:  wp(16),
  lg:  wp(24),
  xl:  wp(32),
  xxl: wp(48),
} as const;

export const Radius = {
  sm:   wp(8),
  md:   wp(12),
  lg:   wp(16),
  xl:   wp(24),
  full: 999,
} as const;

export const FontSize = {
  xs:   fp(11),
  sm:   fp(13),
  md:   fp(15),
  lg:   fp(17),
  xl:   fp(22),
  xxl:  fp(26),
  xxxl: fp(28),
} as const;

export const IconSize = {
  sm:  wp(40),
  md:  wp(56),
  lg:  wp(120),
} as const;