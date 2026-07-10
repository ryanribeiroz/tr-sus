// src/screens/StreetActionsScreen/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/Button';
import { AssignmentService } from '@/services/AssignmentService';
import type { StreetWithNeighborhood } from '@/types';
import { colors, borderRadius, shadows } from '@/theme';

export function StreetActionsScreen() {
  const router = useRouter();
  const { streetId } = useLocalSearchParams<{ streetId: string }>();
  const [street, setStreet] = useState<StreetWithNeighborhood | null>(null);
  const [counts, setCounts] = useState({ households: 0, establishments: 0, riskPoints: 0 });

  useEffect(() => {
    loadStreetData();
  }, [streetId]);

  const loadStreetData = useCallback(async () => {
    if (!streetId) return;
    const s = await AssignmentService.getStreetById(streetId);
    setStreet(s);
    const c = await AssignmentService.getStreetCounts(streetId);
    setCounts(c);
  }, [streetId]);

  if (!streetId) {
    return (
      <ScreenContainer>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>ID da rua não informado</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.streetName}>{street?.name || '...'}</Text>
            <Text style={styles.neighborhood}>{street?.neighborhoodName || ''}</Text>
          </View>
        </View>

        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, shadows.card]}>
            <View style={[styles.summaryIcon, { backgroundColor: colors.primaryLight }]}>
              <Feather name="home" size={18} color={colors.primary} />
            </View>
            <Text style={styles.summaryCount}>{counts.households}</Text>
            <Text style={styles.summaryLabel}>Domicílios</Text>
          </View>
          <View style={[styles.summaryCard, shadows.card]}>
            <View style={[styles.summaryIcon, { backgroundColor: colors.successLight }]}>
              <Feather name="briefcase" size={18} color={colors.success} />
            </View>
            <Text style={styles.summaryCount}>{counts.establishments}</Text>
            <Text style={styles.summaryLabel}>Estab.</Text>
          </View>
          <View style={[styles.summaryCard, shadows.card]}>
            <View style={[styles.summaryIcon, { backgroundColor: colors.warningLight }]}>
              <Feather name="alert-triangle" size={18} color={colors.warning} />
            </View>
            <Text style={styles.summaryCount}>{counts.riskPoints}</Text>
            <Text style={styles.summaryLabel}>Riscos</Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <Text style={styles.sectionTitle}>Novo Cadastro</Text>

          <TouchableOpacity
            style={[styles.actionCard, shadows.card]}
            onPress={() => router.push(`/domicilio/novo?streetId=${streetId}`)}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.primaryLight }]}>
              <Feather name="home" size={22} color={colors.primary} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Novo Domicílio</Text>
              <Text style={styles.actionDesc}>Cadastrar uma nova residência nesta rua</Text>
            </View>
            <Feather name="plus-circle" size={24} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, shadows.card]}
            onPress={() => router.push(`/estabelecimento/novo?streetId=${streetId}`)}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.successLight }]}>
              <Feather name="briefcase" size={22} color={colors.success} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Novo Estabelecimento</Text>
              <Text style={styles.actionDesc}>Registrar escola, comércio, igreja, etc.</Text>
            </View>
            <Feather name="plus-circle" size={24} color={colors.success} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, shadows.card]}
            onPress={() => router.push(`/ponto-de-risco/novo?streetId=${streetId}`)}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.warningLight }]}>
              <Feather name="alert-triangle" size={22} color={colors.warning} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Novo Ponto de Risco</Text>
              <Text style={styles.actionDesc}>Registrar lixo, esgoto, terreno baldio, etc.</Text>
            </View>
            <Feather name="plus-circle" size={24} color={colors.warning} />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.destructive,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.xl,
    backgroundColor: colors.secondary,
  },
  streetName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.foreground,
    letterSpacing: -0.5,
  },
  neighborhood: {
    fontSize: 13,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: borderRadius['2xl'],
    gap: 6,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCount: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.foreground,
  },
  summaryLabel: {
    fontSize: 11,
    color: colors.mutedForeground,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  actions: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.card,
    padding: 18,
    borderRadius: borderRadius['2xl'],
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
  },
  actionDesc: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
});
