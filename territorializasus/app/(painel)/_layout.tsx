import React from 'react';
import { Tabs } from 'expo-router';
import { Home, ClipboardList, Send, User } from 'lucide-react-native';
import { colors } from '@/theme';
import { Platform } from 'react-native';

export default function PainelLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 12,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="atribuicoes"
        options={{
          title: 'Trabalho',
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="sincronizacao"
        options={{
          title: 'Enviar',
          tabBarIcon: ({ color, size }) => <Send color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <User color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
