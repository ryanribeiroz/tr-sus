// src/screens/WorkPanelScreen/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { OfflineIndicator } from '@/components/OfflineBanner';
import { useAuth } from '@/contexts/AuthContext';
import { AssignmentService, type StreetGroupedByNeighborhood } from '@/services/AssignmentService';
import { colors, borderRadius, shadows } from '@/theme';

export function WorkPanelScreen() {
  const router = useRouter();
  const { userId, userName } = useAuth();
  const [groups, setGroups] = useState<StreetGroupedByNeighborhood[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStreets();
  }, []);

  const loadStreets = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await AssignmentService.getStreetsGroupedByNeighborhood(userId);
      setGroups(data);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Painel de Trabalho</Text>
            <OfflineIndicator />
          </View>
        </View>

        {/* Agent info */}
        <View style={styles.agentCard}>
          <View style={styles.agentAvatar}>
            <Feather name="user" size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.agentName}>{userName || 'Agente'}</Text>
            <Text style={styles.agentRole}>Agente de Saúde</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : groups.length === 0 ? (
          <View style={styles.centered}>
            <Feather name="inbox" size={48} color={colors.mutedForeground} />
            <Text style={styles.emptyText}>Nenhuma rua atribuída</Text>
          </View>
        ) : (
          /* Neighborhood groups */
          <View style={styles.groupList}>
            {groups.map((group) => (
              <View key={group.neighborhoodId} style={styles.group}>
                <View style={styles.groupHeader}>
                  <Feather name="map-pin" size={16} color={colors.primary} />
                  <Text style={styles.groupTitle}>{group.neighborhoodName}</Text>
                  <Text style={styles.groupCount}>
                    {group.streets.length} {group.streets.length === 1 ? 'rua' : 'ruas'}
                  </Text>
                </View>
                <View style={styles.streetList}>
                  {group.streets.map((street) => (
                    <TouchableOpacity
                      key={street.id}
                      style={[styles.streetCard, shadows.card]}
                      onPress={() => router.push(`/rua/${street.id}`)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.streetIcon}>
                        <Feather name="navigation" size={16} color={colors.primary} />
                      </View>
                      <View style={styles.streetInfo}>
                        <Text style={styles.streetName}>{street.name}</Text>
                        <Text style={styles.streetMeta}>
                          {street.householdCount > 0
                            ? `${street.householdCount} ${street.householdCount === 1 ? 'domicílio' : 'domicílios'}`
                            : 'Sem coletas'}
                        </Text>
                      </View>
                      <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.xl,
    backgroundColor: colors.secondary,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.foreground,
    letterSpacing: -0.5,
  },
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.primaryLight,
    padding: 16,
    borderRadius: borderRadius['2xl'],
    marginBottom: 24,
  },
  agentAvatar: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
  },
  agentRole: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.mutedForeground,
  },
  groupList: {
    gap: 24,
  },
  group: {
    gap: 12,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
    flex: 1,
  },
  groupCount: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontWeight: '600',
  },
  streetList: {
    gap: 8,
  },
  streetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: borderRadius['2xl'],
  },
  streetIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streetInfo: {
    flex: 1,
  },
  streetName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.foreground,
  },
  streetMeta: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
});
