// src/screens/HouseholdFormScreen/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@expo/vector-icons';

import { ScreenContainer } from '@/components/ScreenContainer';
import { Input } from '@/components/Input';
import { SimpleSelect } from '@/components/Select';
import { Checkbox } from '@/components/Checkbox';
import { Button } from '@/components/Button';
import { FormSection } from '@/components/FormSection';

import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/hooks/useLocation';
import { useAutoSave } from '@/hooks/useAutoSave';
import { HouseholdService } from '@/services/HouseholdService';

import { householdSchema, type HouseholdValidatedData } from '@/validators/household';
import { PROPERTY_TYPES, SAVASSI_ITEMS, RISK_ITEMS } from '@/constants';
import { colors, borderRadius } from '@/theme';
import type { Household } from '@/database';

export function HouseholdFormScreen() {
  const router = useRouter();
  const { streetId } = useLocalSearchParams<{ streetId: string }>();
  const { userId } = useAuth();
  const { captureLocation, isCapturing } = useLocation();

  const [draftId, setDraftId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const { control, handleSubmit, watch, setValue, formState: { errors }, getValues } = useForm<HouseholdValidatedData>({
    resolver: zodResolver(householdSchema) as any,
    defaultValues: {
      numero: '',
      semNumero: false,
      complemento: '',
      referencia: '',
      tipoImovel: 'Casa',
      moradores: 1,
      savassiAcamado: false,
      savassiDesemprego: false,
      savassiRelacaoMoradorComodo: false,
      savassiAnalfabeto: false,
      savassiMenor6m: false,
      savassiIdoso: false,
      savassiGestante: false,
      savassiDeficiencia: false,
      riscoFocoMosquito: false,
      riscoLixo: false,
      riscoAguaParada: false,
      riscoAnimais: false,
      riscoQuintalSujo: false,
      observacoes: '',
    } as any,
  });

  const semNumeroChecked = watch('semNumero');

  // Inicializa o rascunho (draft)
  useEffect(() => {
    const initDraft = async () => {
      if (!streetId || !userId) return;
      const existingDraft = await HouseholdService.findDraftByStreet(streetId);
      if (existingDraft) {
        setDraftId(existingDraft.id);
        populateForm(existingDraft);
      } else {
        const newDraft = await HouseholdService.createDraft(streetId, userId);
        setDraftId(newDraft.id);
      }
    };
    initDraft();
  }, [streetId, userId]);

  const populateForm = (draft: any) => {
    if (draft.numero) setValue('numero', draft.numero);
    if (draft.semNumero) setValue('semNumero', draft.semNumero);
    if (draft.complemento) setValue('complemento', draft.complemento);
    if (draft.referencia) setValue('referencia', draft.referencia);
    if (draft.tipoImovel) setValue('tipoImovel', draft.tipoImovel);
    if (draft.moradores) setValue('moradores', draft.moradores);
    setValue('savassiAcamado', draft.savassiAcamado);
    setValue('savassiDesemprego', draft.savassiDesemprego);
    setValue('savassiRelacaoMoradorComodo', draft.savassiRelacaoMoradorComodo);
    setValue('savassiAnalfabeto', draft.savassiAnalfabeto);
    setValue('savassiMenor6m', draft.savassiMenor6m);
    setValue('savassiIdoso', draft.savassiIdoso);
    setValue('savassiGestante', draft.savassiGestante);
    setValue('savassiDeficiencia', draft.savassiDeficiencia);
    setValue('riscoFocoMosquito', draft.riscoFocoMosquito);
    setValue('riscoLixo', draft.riscoLixo);
    setValue('riscoAguaParada', draft.riscoAguaParada);
    setValue('riscoAnimais', draft.riscoAnimais);
    setValue('riscoQuintalSujo', draft.riscoQuintalSujo);
    if (draft.observacoes) setValue('observacoes', draft.observacoes);
  };

  // Callback de AutoSave
  const performSave = useCallback(async () => {
    if (!draftId) return;
    setSaveStatus('saving');
    try {
      const data = getValues();
      await HouseholdService.updateDraft(draftId, {
        numero: data.numero,
        semNumero: data.semNumero,
        complemento: data.complemento,
        referencia: data.referencia,
        tipoImovel: data.tipoImovel,
        moradores: data.moradores,
        savassi: {
          acamado: data.savassiAcamado,
          desemprego: data.savassiDesemprego,
          relacaoMoradorComodo: data.savassiRelacaoMoradorComodo,
          analfabeto: data.savassiAnalfabeto,
          menor6m: data.savassiMenor6m,
          idoso: data.savassiIdoso,
          gestante: data.savassiGestante,
          deficiencia: data.savassiDeficiencia,
        },
        riscos: {
          focoMosquito: data.riscoFocoMosquito,
          lixo: data.riscoLixo,
          aguaParada: data.riscoAguaParada,
          animais: data.riscoAnimais,
          quintalSujo: data.riscoQuintalSujo,
        },
        observacoes: data.observacoes,
      });
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
  }, [draftId, getValues]);

  const { triggerAutoSave, forceFlush } = useAutoSave(performSave);

  // Monitora alterações para acionar o autosave
  useEffect(() => {
    const subscription = watch(() => {
      triggerAutoSave();
    });
    return () => subscription.unsubscribe();
  }, [watch, triggerAutoSave]);

  const handleBack = async () => {
    await forceFlush();
    router.back();
  };

  const handleCancel = async () => {
    if (draftId) {
      Alert.alert(
        'Cancelar cadastro',
        'Deseja excluir este rascunho?',
        [
          { text: 'Não', style: 'cancel' },
          { 
            text: 'Sim, excluir', 
            style: 'destructive',
            onPress: async () => {
              await HouseholdService.delete(draftId);
              router.back();
            }
          }
        ]
      );
    } else {
      router.back();
    }
  };

  const onSubmit = async (data: HouseholdValidatedData) => {
    if (!draftId || !streetId) return;
    
    // Check duplicates
    if (!data.semNumero) {
      const isDuplicated = await HouseholdService.checkDuplicate(streetId, data.numero);
      if (isDuplicated) {
        return Alert.alert(
          'Número duplicado',
          `Já existe um domicílio registrado com o número ${data.numero} nesta rua. Deseja continuar?`,
          [
            { text: 'Revisar', style: 'cancel' },
            { 
              text: 'Continuar mesmo assim', 
              onPress: () => processSubmit(data)
            }
          ]
        );
      }
    }
    
    processSubmit(data);
  };

  const processSubmit = async (data: HouseholdValidatedData) => {
    if (!draftId) return;
    setSubmitting(true);
    try {
      await forceFlush(); // Garante o último estado salvo
      const loc = await captureLocation();
      
      const savassiAnswers = {
        acamado: data.savassiAcamado,
        desemprego: data.savassiDesemprego,
        relacaoMoradorComodo: data.savassiRelacaoMoradorComodo,
        analfabeto: data.savassiAnalfabeto,
        menor6m: data.savassiMenor6m,
        idoso: data.savassiIdoso,
        gestante: data.savassiGestante,
        deficiencia: data.savassiDeficiencia,
      };

      await HouseholdService.submit(draftId, savassiAnswers, loc);
      router.back();
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        {/* Header & Status */}
        <View style={styles.header}>
          <Feather name="arrow-left" size={24} color={colors.foreground} onPress={handleBack} />
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.headerTitle}>Novo Domicílio</Text>
            {saveStatus === 'saving' && <Text style={styles.saveStatus}>Salvando...</Text>}
            {saveStatus === 'saved' && <Feather name="check-circle" size={16} color={colors.success} />}
          </View>
        </View>

        <View style={styles.content}>
          {/* Identificação */}
          <FormSection step={1} title="Identificação" hint="Dados do imóvel">
            <View style={styles.row}>
              <Controller
                control={control}
                name="numero"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Nº"
                    value={value}
                    onChangeText={onChange}
                    editable={!semNumeroChecked}
                    containerStyle={{ flex: 1 }}
                    keyboardType="number-pad"
                    error={errors.numero?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="semNumero"
                render={({ field: { onChange, value } }) => (
                  <View style={{ marginTop: 22 }}>
                    <Checkbox label="S/N" checked={value} onToggle={(val) => {
                      onChange(val);
                      if (val) setValue('numero', '');
                    }} />
                  </View>
                )}
              />
            </View>

            <Controller
              control={control}
              name="tipoImovel"
              render={({ field: { onChange, value } }) => (
                <SimpleSelect
                  label="Tipo de imóvel"
                  options={PROPERTY_TYPES}
                  value={value}
                  onValueChange={onChange}
                />
              )}
            />
          </FormSection>

          {/* Coelho-Savassi */}
          <FormSection step={2} title="Escala Coelho-Savassi" hint="Selecione as condições encontradas">
            <View style={styles.checklist}>
              {SAVASSI_ITEMS.map((item) => (
                <Controller
                  key={item.key}
                  control={control}
                  name={`savassi${item.key.charAt(0).toUpperCase() + item.key.slice(1)}` as any}
                  render={({ field: { onChange, value } }) => (
                    <Checkbox label={item.label} checked={!!value} onToggle={onChange} />
                  )}
                />
              ))}
            </View>
          </FormSection>

          {/* Riscos */}
          <FormSection step={3} title="Riscos Ambientais" hint="Opcional">
            <View style={styles.checklist}>
              {RISK_ITEMS.map((item) => (
                <Controller
                  key={item.key}
                  control={control}
                  name={`risco${item.key.charAt(0).toUpperCase() + item.key.slice(1)}` as any}
                  render={({ field: { onChange, value } }) => (
                    <Checkbox label={item.label} checked={!!value} onToggle={onChange} />
                  )}
                />
              ))}
            </View>
          </FormSection>
        </View>

        <View style={styles.footer}>
          <Button
            title="Cancelar Cadastro"
            variant="ghost"
            onPress={handleCancel}
            disabled={submitting}
          />
          <Button
            title="Salvar Domicílio"
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
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: colors.foreground },
  saveStatus: { fontSize: 12, color: colors.mutedForeground, fontWeight: '600' },
  content: { padding: 20, gap: 32 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  checklist: { gap: 8 },
  footer: { padding: 20, gap: 12, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border },
});
