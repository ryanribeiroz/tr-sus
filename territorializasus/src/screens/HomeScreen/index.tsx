// src/screens/HomeScreen/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { CloudDownload, MapPin, Home as HomeIcon, AlertTriangle, Building2, Wifi, WifiOff, ChevronRight, Loader2 } from 'lucide-react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/Button';
import { Stat } from '@/components/Stat';
import { useAuth } from '@/contexts/AuthContext';
import { useConnectivity } from '@/contexts/ConnectivityContext';
import { SynchronizationService } from '@/services/SynchronizationService';
import { AssignmentService } from '@/services/AssignmentService';
import { database } from '@/database';
import { Q } from '@nozbe/watermelondb';
import { colors, borderRadius, shadows } from '@/theme';

export function HomeScreen() {
  const router = useRouter();
  const { userName } = useAuth();
  const { isOnline } = useConnectivity();
  const [hasData, setHasData] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Stats
  const [stats, setStats] = useState({ ruas: 0, domicilios: 0, pontosRisco: 0, estabelecimentos: 0, pendentes: 0 });

  const loadData = useCallback(async () => {
    try {
      const has = await AssignmentService.hasAssignments();
      setHasData(has);
      
      // Simple count of local records
      const ruas = await database.get('streets').query().fetchCount();
      const domicilios = await database.get('households').query().fetchCount();
      const pontosRisco = await database.get('risk_points').query().fetchCount();
      const estabelecimentos = await database.get('establishments').query().fetchCount();
      
      // Calculate pending syncs
      const pendingQ = Q.where('sync_status', 'pending');
      let pendentes = 0;
      if (pendingQ) {
        const d = await database.get('households').query(pendingQ).fetchCount();
        const p = await database.get('risk_points').query(pendingQ).fetchCount();
        const e = await database.get('establishments').query(pendingQ).fetchCount();
        pendentes = d + p + e;
      }
      
      setStats({ ruas, domicilios, pontosRisco, estabelecimentos, pendentes });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSync = async () => {
    if (!isOnline) {
      alert("Você está offline. Conecte-se à internet para sincronizar.");
      return;
    }
    setSyncing(true);
    try {
      await SynchronizationService.pullInitialAssignments();
      await loadData();
      if (!hasData) {
        router.push('/atribuicoes');
      }
    } catch (err) {
      alert("Falha ao sincronizar. Tente novamente.");
    } finally {
      setSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer scrollable={false}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={true}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, agente</Text>
            <Text style={styles.name}>{userName || 'Agente'}</Text>
          </View>
          <View style={[styles.wifiBadge, { backgroundColor: isOnline ? colors.successLight : colors.warningLight }]}>
            {isOnline ? <Wifi color={colors.success} size={20} /> : <WifiOff color={colors.warning} size={20} />}
          </View>
        </View>

        <View style={styles.content}>
          {/* Main Card */}
          {!hasData ? (
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.emptyCard, shadows.elevated]}
            >
              <View style={styles.emptyCardIcon}>
                <CloudDownload color={colors.white} size={28} />
              </View>
              <Text style={styles.emptyCardTitle}>Nenhuma atribuição baixada</Text>
              <Text style={styles.emptyCardSubtitle}>
                Antes de sair para o campo, sincronize para baixar as ruas e bairros do seu turno.
              </Text>
              <TouchableOpacity 
                style={styles.emptyCardButton} 
                onPress={handleSync} 
                disabled={syncing}
                activeOpacity={0.8}
              >
                {syncing ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <>
                    <CloudDownload color={colors.primary} size={16} />
                    <Text style={styles.emptyCardButtonText}>Sincronizar agora</Text>
                  </>
                )}
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <View style={[styles.dataCard, shadows.card]}>
              <View style={styles.dataCardHeader}>
                <View>
                  <Text style={styles.dataCardLabel}>HOJE NO TERRITÓRIO</Text>
                  <Text style={styles.dataCardValue}>{stats.ruas} ruas atribuídas</Text>
                </View>
                <TouchableOpacity style={styles.dataCardAction} onPress={() => router.push('/atribuicoes')}>
                  <Text style={styles.dataCardActionText}>Ver</Text>
                  <ChevronRight color={colors.primary} size={16} />
                </TouchableOpacity>
              </View>
              <Button
                title="Atualizar lista"
                variant="outline"
                onPress={handleSync}
                loading={syncing}
                icon={<CloudDownload color={colors.primary} size={16} />}
              />
            </View>
          )}

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <Stat icon={HomeIcon} label="Domicílios" value={stats.domicilios} tone="primary" />
            <Stat icon={AlertTriangle} label="Riscos" value={stats.pontosRisco} tone="warning" />
            <Stat icon={Building2} label="Locais" value={stats.estabelecimentos} tone="success" />
          </View>

          {/* Pendentes */}
          {stats.pendentes > 0 && (
            <TouchableOpacity style={styles.pendingCard} onPress={() => router.push('/sincronizacao')} activeOpacity={0.8}>
              <View style={styles.pendingCardLeft}>
                <View style={styles.pendingIcon}>
                  <AlertTriangle color={colors.warning} size={20} />
                </View>
                <View>
                  <Text style={styles.pendingTitle}>
                    {stats.pendentes} cadastro{stats.pendentes > 1 ? 's' : ''} na fila
                  </Text>
                  <Text style={styles.pendingSubtitle}>Toque para sincronizar com o servidor</Text>
                </View>
              </View>
              <ChevronRight color={colors.mutedForeground} size={20} />
            </TouchableOpacity>
          )}

          {/* Next Steps */}
          {hasData && (
            <View style={styles.nextStepsCard}>
              <Text style={styles.nextStepsLabel}>PRÓXIMOS PASSOS</Text>
              <View style={styles.nextStepsRow}>
                <MapPin color={colors.primary} size={16} />
                <Text style={styles.nextStepsText}>Abra <Text style={{fontWeight: 'bold'}}>Trabalho</Text> e selecione a rua para começar.</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.foreground,
    letterSpacing: -0.5,
  },
  wifiBadge: {
    padding: 12,
    borderRadius: borderRadius['2xl'],
  },
  content: {
    paddingHorizontal: 24,
    gap: 16,
  },
  emptyCard: {
    padding: 24,
    borderRadius: borderRadius['3xl'],
  },
  emptyCardIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius['2xl'],
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryForeground,
    lineHeight: 24,
  },
  emptyCardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyCardButton: {
    backgroundColor: colors.white,
    height: 48,
    borderRadius: borderRadius['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyCardButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  dataCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius['3xl'],
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dataCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dataCardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dataCardValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    marginTop: 2,
  },
  dataCardAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataCardActionText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  pendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.warningLight,
    borderColor: colors.warningBorder,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    padding: 16,
  },
  pendingCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pendingIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.xl,
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.foreground,
  },
  pendingSubtitle: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  nextStepsCard: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius['2xl'],
    padding: 16,
  },
  nextStepsLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  nextStepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nextStepsText: {
    fontSize: 14,
    color: colors.foreground,
  },
});
