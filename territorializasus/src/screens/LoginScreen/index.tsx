// src/screens/LoginScreen/index.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema, type LoginFormData } from '@/validators/auth';
import { colors, borderRadius, shadows } from '@/theme';

export function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { cpf: '', senha: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setLoginError('');
    try {
      const result = await login(data.cpf, data.senha);
      if (result.success) {
        router.replace('/(painel)');
      } else {
        setLoginError(result.error || 'Erro ao fazer login');
      }
    } catch (err: any) {
      setLoginError(`Erro inesperado: ${err?.message || String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBg}>
              <Feather name="map-pin" size={36} color={colors.white} />
            </View>
          </View>
          <Text style={styles.title}>TerritorializaSUS</Text>
          <Text style={styles.subtitle}>
            Coleta estruturada para territorialização em saúde
          </Text>
        </View>

        {/* Form card */}
        <View style={[styles.card, shadows.card]}>
          <Text style={styles.cardTitle}>Entrar no sistema</Text>

          {loginError ? (
            <View style={styles.errorBanner}>
              <Feather name="alert-circle" size={16} color={colors.destructive} />
              <Text style={styles.errorBannerText}>{loginError}</Text>
            </View>
          ) : null}

          <Controller
            control={control}
            name="cpf"
            render={({ field: { onChange, value } }) => (
              <Input
                label="CPF"
                placeholder="000.000.000-00"
                value={value}
                onChangeText={onChange}
                keyboardType="numeric"
                error={errors.cpf?.message}
                leftIcon={<Feather name="user" size={18} color={colors.mutedForeground} />}
              />
            )}
          />

          <Controller
            control={control}
            name="senha"
            render={({ field: { onChange, value } }) => (
              <Input
                label="SENHA"
                placeholder="Digite sua senha"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                error={errors.senha?.message}
                leftIcon={<Feather name="lock" size={18} color={colors.mutedForeground} />}
                containerStyle={{ marginTop: 16 }}
              />
            )}
          />

          <Button
            title="Entrar"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={{ marginTop: 20 }}
            icon={!loading ? <Feather name="log-in" size={20} color={colors.white} /> : undefined}
          />
        </View>

        {/* Dev hint */}
        <View style={styles.devHint}>
          <Feather name="info" size={14} color={colors.mutedForeground} />
          <Text style={styles.devHintText}>
            Fase 1 — Autenticação provisória{'\n'}
            Use qualquer CPF com 11 dígitos
          </Text>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoBg: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.foreground,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius['3xl'],
    padding: 24,
    gap: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.destructiveLight,
    padding: 12,
    borderRadius: borderRadius.lg,
    marginBottom: 12,
  },
  errorBannerText: {
    fontSize: 13,
    color: colors.destructive,
    fontWeight: '600',
    flex: 1,
  },
  devHint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 24,
    paddingHorizontal: 8,
  },
  devHintText: {
    fontSize: 12,
    color: colors.mutedForeground,
    lineHeight: 18,
    flex: 1,
  },
});
