// components/MapComponent.tsx
import React from 'react';
import { Platform, View, Text, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/theme';

// Importaciones condicionales
let MapView, Marker, PROVIDER_GOOGLE;

if (Platform.OS !== 'web') {
  // Solo importar en móvil
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
}

export default function MapComponent({ region, location, markers = [], onRegionChange }) {
  // Para web, mostrar un placeholder o usar Google Maps JS
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: Colors.textMedium, textAlign: 'center' }}>
          🗺️ Mapa disponible solo en dispositivos móviles
        </Text>
        <Text style={{ color: Colors.textLight, fontSize: 12, marginTop: 8 }}>
          Abre esta app en tu teléfono para ver el mapa
        </Text>
      </View>
    );
  }

  // Para móvil, mostrar el mapa real
  if (!MapView) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={{ flex: 1 }}
      region={region}
      showsUserLocation={true}
      showsMyLocationButton={true}
      onRegionChangeComplete={onRegionChange}
    >
      {location && (
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Tu ubicación"
        />
      )}
      {markers.map((marker, index) => (
        <Marker
          key={index}
          coordinate={marker.coordinate}
          title={marker.title}
          description={marker.description}
        />
      ))}
    </MapView>
  );
}