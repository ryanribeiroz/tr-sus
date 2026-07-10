// src/screens/RiskPointFormScreen/index.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Input } from '@/components/Input';
import { SimpleSelect } from '@/components/Select';
import { Button } from '@/components/Button';
import { FormSection } from '@/components/FormSection';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/hooks/useLocation';
import { RiskPointService } from '@/services/RiskPointService';
import { riskPointSchema, type RiskPointValidatedData } from '@/validators/riskPoint';
import { RISK_POINT_TYPES } from '@/constants';
import { colors, borderRadius } from '@/theme';

export function RiskPointFormScreen() {
  const router = useRouter();
  const { streetId } = useLocalSearchParams<{ streetId: string }>();
  const { userId } = useAuth();
  const { captureLocation, isCapturing } = useLocation();
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<RiskPointValidatedData>({
    resolver: zodResolver(riskPointSchema) as any,
    defaultValues: { tipo: '', descricao: '' } as any,
  });

  const onSubmit = async (data: RiskPointValidatedData) => {
    if (!streetId || !userId) return;
    setSubmitting(true);
    try {
      const loc = await captureLocation();
      
      await RiskPointService.create({
        streetId,
        createdBy: userId,
        tipo: data.tipo,
        descricao: data.descricao,
        location: loc,
      });
      router.back();
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <Feather
            name="arrow-left"
            size={24}
            color={colors.foreground}
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>Ponto de Risco</Text>
        </View>

        <View style={styles.content}>
          <FormSection step={1} title="Detalhes do Risco">
            <Controller
              control={control}
              name="tipo"
              render={({ field: { onChange, value } }) => (
                <SimpleSelect
                  label="Classificação"
                  options={RISK_POINT_TYPES}
                  value={value}
                  onValueChange={onChange}
                />
              )}
            />
            {errors.tipo && <Text style={styles.errorText}>{errors.tipo.message}</Text>}

            <Controller
              control={control}
              name="descricao"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Observações / Descrição"
                  placeholder="Detalhes adicionais do ponto de risco..."
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={4}
                  containerStyle={{ marginTop: 16 }}
                  style={{ height: 100, textAlignVertical: 'top', paddingTop: 16 }}
                  error={errors.descricao?.message}
                />
              )}
            />
          </FormSection>
        </View>

        <View style={styles.footer}>
          <View style={[styles.infoBanner, { backgroundColor: colors.warningLight }]}>
            <Feather name="alert-triangle" size={16} color={colors.warning} />
            <Text style={[styles.infoText, { color: colors.warning }]}>
              A localização exata é importante. Fique o mais próximo possível do local.
            </Text>
          </View>

          <Button
            title="Salvar Ponto de Risco"
            onPress={handleSubmit(onSubmit)}
            loading={submitting || isCapturing}
            icon={<Feather name="check" size={20} color={colors.white} />}
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.foreground,
  },
  content: {
    padding: 20,
    gap: 24,
  },
  errorText: {
    fontSize: 12,
    color: colors.destructive,
    marginTop: 4,
  },
  footer: {
    padding: 20,
    gap: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: borderRadius.xl,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
});
