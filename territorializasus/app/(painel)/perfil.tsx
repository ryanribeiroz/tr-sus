import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { colors, borderRadius } from '@/theme';
import { User, LogOut } from 'lucide-react-native';

export default function PerfilScreen() {
  const { userName, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <User color={colors.primary} size={48} />
        </View>
        <Text style={styles.name}>{userName || 'Agente'}</Text>
        <Text style={styles.role}>Agente Comunitário de Saúde</Text>
      </View>

      <View style={styles.section}>
        <Button
          title="Sair do aplicativo"
          variant="outline"
          onPress={logout}
          icon={<LogOut color={colors.destructive} size={20} />}
          style={styles.logoutButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.foreground,
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  section: {
    flex: 1,
  },
  logoutButton: {
    borderColor: colors.destructive,
  },
});
