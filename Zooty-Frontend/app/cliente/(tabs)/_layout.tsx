import React from 'react';
import { Tabs } from 'expo-router';
import {
  View, Text, StyleSheet, Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';

type TabIconProps = {
  name: 'home' | 'search' | 'calendar' | 'paw' | 'person';
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
      case 'search':
        return <Ionicons name={focused ? 'search' : 'search-outline'} {...props} />;
      case 'calendar':
        return <Ionicons name={focused ? 'calendar' : 'calendar-outline'} {...props} />;
      case 'paw':
        return <MaterialCommunityIcons name={focused ? 'paw' : 'paw-outline'} {...props} />;
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

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabelBase,

        // 🔥 Esto elimina efectos tipo "flecha" o resaltado extraño
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Inicio" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="buscar"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ focused }) => <TabIcon name="search" focused={focused} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Buscar" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="citas"
        options={{
          title: 'Citas',
          tabBarIcon: ({ focused }) => <TabIcon name="calendar" focused={focused} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Citas" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="mascotas"
        options={{
          title: 'Mascotas',
          tabBarIcon: ({ focused }) => <TabIcon name="paw" focused={focused} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Mascotas" focused={focused} />,
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

  // 🔥 IMPORTANTE: limpia cualquier indicador raro
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