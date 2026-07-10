// src/screens/EstablishmentFormScreen/index.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
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
import { EstablishmentService } from '@/services/EstablishmentService';
import { establishmentSchema, type EstablishmentValidatedData } from '@/validators/establishment';
import { ESTABLISHMENT_TYPES } from '@/constants';
import { colors, borderRadius, shadows } from '@/theme';

export function EstablishmentFormScreen() {
  const router = useRouter();
  const { streetId } = useLocalSearchParams<{ streetId: string }>();
  const { userId } = useAuth();
  const { captureLocation, isCapturing } = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [gpsCaptured, setGpsCaptured] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<EstablishmentValidatedData>({
    resolver: zodResolver(establishmentSchema),
    defaultValues: { nome: '', tipo: '' },
  });

  const onSubmit = async (data: EstablishmentValidatedData) => {
    if (!streetId || !userId) return;
    setSubmitting(true);
    try {
      // Captura a localização no momento de salvar, conforme regra do app (offline sem falhar se não conseguir)
      const loc = await captureLocation();
      
      await EstablishmentService.create({
        streetId,
        createdBy: userId,
        nome: data.nome,
        tipo: data.tipo,
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
          <Text style={styles.headerTitle}>Novo Estabelecimento</Text>
        </View>

        <View style={styles.content}>
          <FormSection step={1} title="Identificação" hint="Dados do estabelecimento">
            <Controller
              control={control}
              name="nome"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Nome do estabelecimento"
                  placeholder="Ex: Mercearia do Zé"
                  value={value}
                  onChangeText={onChange}
                  error={errors.nome?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="tipo"
              render={({ field: { onChange, value } }) => (
                <SimpleSelect
                  label="Tipo de estabelecimento"
                  options={ESTABLISHMENT_TYPES}
                  value={value}
                  onValueChange={onChange}
                  containerStyle={{ marginTop: 16 }}
                />
              )}
            />
            {errors.tipo && <Text style={styles.errorText}>{errors.tipo.message}</Text>}
          </FormSection>
        </View>

        <View style={styles.footer}>
          <View style={styles.infoBanner}>
            <Feather name="map-pin" size={16} color={colors.primary} />
            <Text style={styles.infoText}>
              A localização (GPS) será capturada ao salvar, mesmo offline.
            </Text>
          </View>

          <Button
            title="Salvar Estabelecimento"
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
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderRadius: borderRadius.xl,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: colors.primary,
    lineHeight: 18,
  },
});
