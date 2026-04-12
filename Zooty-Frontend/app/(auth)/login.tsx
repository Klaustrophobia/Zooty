import Logo from '@/components/Logo';
import { hp, wp, SCREEN_HEIGHT } from '@/constants/Responsive';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated, Platform,
  SafeAreaView, ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Estados para el mensaje de éxito
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Verificar si venimos del registro exitoso
    if (params.registrationSuccess === 'true') {
      setSuccessMessage(params.message as string || '¡Registro exitoso! Revisa tu correo para activar tu cuenta.');
      setShowSuccessMessage(true);
      
      // Animación de entrada
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
        tension: 40
      }).start();
      
      // Ocultar automáticamente después de 6 segundos
      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true
        }).start(() => setShowSuccessMessage(false));
      }, 6000);
      
      return () => clearTimeout(timer);
    }
  }, [params]);

  const validateForm = () => {
    let isValid = true;
    
    if (!email || !email.includes('@')) {
      setEmailError('Introduce un correo electrónico válido.');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    if (!password || password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres.');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);

    // Dinámica para identificar el rol según el correo (Simulado)
    // En una app real, esto vendría de la respuesta de tu API de autenticación
    const emailLower = email.toLowerCase();
    
    if (emailLower.includes('pro')) {
      // Es una cuenta profesional
      router.replace('/profesional/(tabs)/inicio');
    } else {
      // Es una cuenta de cliente
      // router.replace('/cliente/(tabs)/inicio');
      // Por ahora redirigimos a una ruta existente o mostramos alerta si no existe
      alert('Login como Cliente (Ruta /cliente no implementada aún)');
    }
  };

  const closeSuccessMessage = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true
    }).start(() => setShowSuccessMessage(false));
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Mensaje de éxito animado */}
      {showSuccessMessage && (
        <Animated.View 
          style={[
            styles.successMessage,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.successContent}>
            <Ionicons name="checkmark-circle" size={wp(24)} color="#2E7D32" />
            <View style={styles.successTextContainer}>
              <Text style={styles.successTitle}>¡Registro completado!</Text>
              <Text style={styles.successSubtitle}>{successMessage}</Text>
            </View>
            <TouchableOpacity 
              onPress={closeSuccessMessage}
              style={styles.successClose}
            >
              <Ionicons name="close" size={wp(20)} color="#2E7D32" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
   
        {/* Logo y marca */}
        <View style={styles.logoSection}>
          <Logo size="lg" />
          {/* <Text style={styles.brand}>Zooty</Text> */}
          <Text style={styles.tagline}>
            Conecta con los mejores profesionales{'\n'}para tu mascota
          </Text>
        </View>

        {/* Formulario de login */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Iniciar sesión</Text>
          <Text style={styles.cardSubtitle}>
            Ingresa tus credenciales para continuar
          </Text>

          {/* Campo email */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Correo electrónico</Text>
            <View style={[styles.inputContainer, emailError ? styles.inputError : null]}>
              <TextInput
                style={styles.input}
                placeholder="tu@correo.com"
                placeholderTextColor={Colors.placeholder}
                value={email}
                onChangeText={(t) => { 
                  setEmail(t); 
                  setEmailError(''); 
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>

          {/* Campo contraseña */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Contraseña</Text>
            <View style={[styles.inputContainer, passwordError ? styles.inputError : null]}>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu contraseña"
                placeholderTextColor={Colors.placeholder}
                value={password}
                onChangeText={(t) => { 
                  setPassword(t); 
                  setPasswordError(''); 
                }}
                secureTextEntry={!showPass}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Ionicons 
                  name={showPass ? "eye-off-outline" : "eye-outline"} 
                  size={wp(20)} 
                  color={Colors.textLight} 
                />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

          {/* Olvidé contraseña */}
          <TouchableOpacity style={styles.forgotLink}>
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          {/* Botón login */}
          <TouchableOpacity
            style={[styles.ctaButton, loading && styles.ctaButtonLoading]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.ctaText}>Iniciar sesión</Text>
            )}
          </TouchableOpacity>

          {/* Separador */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Botones sociales */}
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
            <Text style={styles.socialText}>Continuar con Apple</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
            <Text style={styles.socialText}>Continuar con Google</Text>
          </TouchableOpacity>
        </View>

        {/* Footer: ir a registro */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/role-selection')}>
            <Text style={styles.footerLink}>Regístrate gratis</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  scroll: { 
    paddingHorizontal: Spacing.lg, 
    paddingBottom: Spacing.xxl 
  },

  /* Logo */
  logoSection: { 
    alignItems: 'center', 
    marginTop: SCREEN_HEIGHT * 0.05, // 5% de la altura - responsive sin afectar diseño
    marginBottom: hp(32) 
  },
  brand: {
    fontSize: FontSize.xxxl, // Mantener tamaño original del tema
    fontWeight: '800',
    color: Colors.primary,
    marginTop: hp(12),
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
    textAlign: 'center',
    lineHeight: hp(20),
    marginTop: hp(6),
  },

  /* Card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: wp(16),
    shadowOffset: { width: 0, height: hp(4) },
    elevation: 4,
    marginBottom: Spacing.lg,
  },

  /* Titles */
  cardTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: hp(4),
  },
  cardSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
    lineHeight: hp(20),
    marginBottom: Spacing.lg,
  },

  /* Fields */
  fieldWrapper: { 
    marginBottom: Spacing.md 
  },
  fieldLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: hp(6),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md,
    height: hp(52),
  },
  inputError: { 
    borderColor: Colors.error 
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textDark,
    paddingVertical: hp(12),
  },
  errorText: { 
    fontSize: FontSize.xs, 
    color: Colors.error, 
    marginTop: hp(4) 
  },

  /* CTA */
  ctaButton: {
    width: '100%',
    height: hp(54),
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.32,
    shadowRadius: wp(10),
    shadowOffset: { width: 0, height: hp(4) },
    elevation: 5,
    marginBottom: Spacing.md,
  },
  ctaButtonLoading: { 
    opacity: 0.75 
  },
  ctaText: { 
    color: Colors.white, 
    fontSize: FontSize.lg, 
    fontWeight: '600' 
  },

  /* Divider */
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginVertical: Spacing.md,
  },
  dividerLine: { 
    flex: 1, 
    height: 1, 
    backgroundColor: Colors.borderLight 
  },
  dividerText: { 
    fontSize: FontSize.sm, 
    color: Colors.textLight 
  },

  /* Social */
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(50),
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.white,
  },
  socialText: { 
    fontSize: FontSize.md, 
    color: Colors.textDark, 
    fontWeight: '500' 
  },

  /* Olvidé contraseña */
  forgotLink: { 
    alignSelf: 'flex-end', 
    marginBottom: Spacing.lg 
  },
  forgotText: { 
    fontSize: FontSize.sm, 
    color: Colors.primary, 
    fontWeight: '500' 
  },

  /* Footer */
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  footerText: { 
    fontSize: FontSize.sm, 
    color: Colors.textMedium 
  },
  footerLink: { 
    fontSize: FontSize.sm, 
    color: Colors.primary, 
    fontWeight: '700' 
  },

  /* Mensaje de éxito */
  successMessage: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? hp(60) : hp(20),
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 1000,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: wp(12),
    shadowOffset: { width: 0, height: hp(4) },
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  successContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  successTextContainer: {
    flex: 1,
  },
  successTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: hp(2),
  },
  successSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
    lineHeight: hp(18),
  },
  successClose: {
    padding: Spacing.xs,
  },
});