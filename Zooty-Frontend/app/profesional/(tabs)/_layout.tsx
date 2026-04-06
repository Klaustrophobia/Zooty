import React from 'react';
import { Tabs } from 'expo-router';
import {
  View, Text, StyleSheet, Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';

type TabIconProps = {
  name: 'home' | 'calendar' | 'people' | 'finance' | 'person';
  focused: boolean;
};

function TabIcon({ name, focused }: TabIconProps) {
  const getIcon = () => {
    const props = {
      size: wp(22),
      color: focused ? Colors.primary : Colors.textLight,
    };

    switch (name) {
      case 'home':
        return <Ionicons name={focused ? 'home' : 'home-outline'} {...props} />;
      case 'calendar':
        return <Ionicons name={focused ? 'calendar' : 'calendar-outline'} {...props} />;
      case 'people':
        return <Ionicons name={focused ? 'people' : 'people-outline'} {...props} />;
      case 'finance':
        return <MaterialCommunityIcons name={focused ? 'cash' : 'cash-multiple'} {...props} />;
      case 'person':
        return <Ionicons name={focused ? 'person' : 'person-outline'} {...props} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.iconWrapper}>
      {getIcon()}
    </View>
  );
}

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
      {label}
    </Text>
  );
}

export default function ProTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabelBase,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="inicio"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Inicio" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="calendario"
        options={{
          title: 'Calendario',
          tabBarIcon: ({ focused }) => <TabIcon name="calendar" focused={focused} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Calendario" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="clientes"
        options={{
          title: 'Clientes',
          tabBarIcon: ({ focused }) => <TabIcon name="people" focused={focused} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Clientes" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="finanzas"
        options={{
          title: 'Finanzas',
          tabBarIcon: ({ focused }) => <TabIcon name="finance" focused={focused} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Finanzas" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => <TabIcon name="person" focused={focused} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Perfil" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#EDF2F4',
    height: Platform.OS === 'ios' ? hp(84) : hp(64),
    paddingBottom: Platform.OS === 'ios' ? hp(24) : hp(8),
    paddingTop: hp(8),
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: wp(12),
    shadowOffset: { width: 0, height: -hp(2) },
    elevation: 10,
  },

  tabItem: {
    borderTopWidth: 0,
  },

  iconWrapper: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabLabelBase: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },

  tabLabel: {
    fontSize: wp(10),
    color: Colors.textLight,
    fontWeight: '500',
    marginTop: -hp(2),
  },

  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});