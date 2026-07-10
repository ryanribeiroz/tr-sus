// src/screens/SynchronizationScreen/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/Button';
import { OfflineBanner } from '@/components/OfflineBanner';
import { SynchronizationService } from '@/services/SynchronizationService';
import { useConnectivity } from '@/contexts/ConnectivityContext';
import { colors, borderRadius, shadows } from '@/theme';

export function SynchronizationScreen() {
  const router = useRouter();
  const { isOnline } = useConnectivity();
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<{ ok: number; fail: number } | null>(null);

  useEffect(() => {
    loadPendingCount();
  }, []);

  const loadPendingCount = useCallback(async () => {
    const count = await SynchronizationService.countPending();
    setPendingCount(count);
  }, []);

  const handleSync = async () => {
    if (pendingCount === 0 || !isOnline) return;
    setSyncing(true);
    setResult(null);
    try {
      const res = await SynchronizationService.pushPendingRecords();
      setResult(res);
      await loadPendingCount();
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.header}>
          <Feather name="arrow-left" size={24} color={colors.foreground} onPress={() => router.back()} />
          <Text style={styles.headerTitle}>Sincronização</Text>
        </View>

        <View style={styles.content}>
          <OfflineBanner />

          <View style={[styles.card, shadows.card]}>
            <View style={styles.statusCircle}>
              <Text style={styles.statusNumber}>{pendingCount}</Text>
            </View>
            <Text style={styles.cardTitle}>Registros Pendentes</Text>
            <Text style={styles.cardDesc}>
              {pendingCount === 0
                ? 'Tudo em dia! Não há dados locais pendentes de envio.'
                : 'Há cadastros salvos offline aguardando conexão para envio ao servidor.'}
            </Text>

            {result && (
              <View style={styles.resultBox}>
                <Text style={styles.resultText}>Última tentativa:</Text>
                {result.ok > 0 && (
                  <View style={styles.resultRow}>
                    <Feather name="check-circle" size={16} color={colors.success} />
                    <Text style={[styles.resultText, { color: colors.success }]}>
                      {result.ok} enviados com sucesso
                    </Text>
                  </View>
                )}
                {result.fail > 0 && (
                  <View style={styles.resultRow}>
                    <Feather name="x-circle" size={16} color={colors.destructive} />
                    <Text style={[styles.resultText, { color: colors.destructive }]}>
                      {result.fail} falharam (verifique a internet)
                    </Text>
                  </View>
                )}
              </View>
            )}

            <Button
              title="Sincronizar Agora"
              onPress={handleSync}
              loading={syncing}
              disabled={pendingCount === 0 || !isOnline}
              icon={<Feather name="upload-cloud" size={20} color={colors.white} />}
              style={{ marginTop: 20 }}
            />
          </View>
        </View>
      </View>
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
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: colors.foreground },
  content: { padding: 20, gap: 24 },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius['3xl'],
    padding: 24,
    alignItems: 'center',
  },
  statusCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statusNumber: { fontSize: 32, fontWeight: '800', color: colors.primary },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.foreground, marginBottom: 8 },
  cardDesc: { fontSize: 14, color: colors.mutedForeground, textAlign: 'center', lineHeight: 20 },
  resultBox: {
    alignSelf: 'stretch',
    marginTop: 24,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    gap: 8,
  },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resultText: { fontSize: 13, fontWeight: '600' },
});
