import React, { useState, useEffect } from "react";
import Slider from "@react-native-community/slider";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  Alert,
  Platform,
  Image,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Spacing, Radius, FontSize } from "@/constants/theme";
import { wp, hp } from "@/constants/Responsive";
import { API_URL } from "@/services/api";

let MapView: any = View;
let Marker: any = View;
let PROVIDER_GOOGLE: any = undefined;

if (Platform.OS !== "web") {
  try {
    const Maps = require("react-native-maps");
    MapView = Maps.default;
    Marker = Maps.Marker;
    PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
  } catch (e) {
    console.log("Mapas no disponibles");
  }
}

// const PROFESSIONALS = [
//   { id: '1', name: 'Dr. Carlos Ruiz',       specialty: 'Veterinario', distance: 1.2, rating: 4.8, price: 25,  online: true,  lat: 14.0723, lng: -87.1921 },
//   { id: '2', name: 'Elena Martínez',         specialty: 'Paseadora',   distance: 0.5, rating: 4.9, price: 15,  online: true,  lat: 14.0823, lng: -87.2021 },
//   { id: '3', name: 'Roberto Gómez',          specialty: 'Peluquería',  distance: 2.8, rating: 4.7, price: 20,  online: false, lat: 14.0623, lng: -87.1821 },
//   { id: '4', name: 'Clínica VetLife',        specialty: 'Veterinario', distance: 3.1, rating: 4.5, price: 40,  online: true,  lat: 14.0923, lng: -87.1721 },
//   { id: '5', name: 'Ana Paseos',             specialty: 'Paseadora',   distance: 1.8, rating: 4.6, price: 12,  online: true,  lat: 14.0523, lng: -87.2121 },
//   { id: '6', name: 'Spa Canino',             specialty: 'Peluquería',  distance: 2.2, rating: 4.9, price: 35,  online: false, lat: 14.1023, lng: -87.1621 },
// ];

const CATEGORIES = [
  "Veterinario",
  "Peluquería",
  "Paseador",
  "Entrenamiento",
  "Guardería",
  "Tienda",
];

const HONDURAS_CENTER = {
  latitude: 14.1077,
  longitude: -87.2419,
  latitudeDelta: 7.0,
  longitudeDelta: 7.0,
};

function FilterModal({
  visible,
  onClose,
  onApply,
}: {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: 1500 });
  const [tempMinRating, setTempMinRating] = useState(0);
  const [tempMaxDistance, setTempMaxDistance] = useState(150);

  const toggleCategory = (c: string) => {
    setSelectedCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  };

  const handleApply = () => {
    onApply({
      categories: selectedCategories,
      priceRange: tempPriceRange,
      minRating: tempMinRating,
      maxDistance: tempMaxDistance,
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedCategories([]);
    setTempPriceRange({ min: 0, max: 1500 });
    setTempMinRating(0);
    setTempMaxDistance(50);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={fStyles.safe}>
        <View style={fStyles.header}>
          <Text style={fStyles.title}>Filtrar por</Text>
          <TouchableOpacity onPress={onClose} style={fStyles.closeBtn}>
            <Ionicons name="close" size={wp(18)} color={Colors.textMedium} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={fStyles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={fStyles.sectionLabel}>CATEGORÍA</Text>
          <View style={fStyles.categoriesGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  fStyles.categoryItem,
                  selectedCategories.includes(cat) && fStyles.categoryItemOn,
                ]}
                onPress={() => toggleCategory(cat)}
              >
                <View
                  style={[
                    fStyles.checkbox,
                    selectedCategories.includes(cat) && fStyles.checkboxOn,
                  ]}
                >
                  {selectedCategories.includes(cat) && (
                    <Ionicons
                      name="checkmark"
                      size={wp(12)}
                      color={Colors.white}
                    />
                  )}
                </View>
                <Text
                  style={[
                    fStyles.categoryText,
                    selectedCategories.includes(cat) && fStyles.categoryTextOn,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={fStyles.sectionRow}>
            <Text style={fStyles.sectionLabel}>PRECIO MÁXIMO</Text>
            <Text style={fStyles.sectionValue}>${tempPriceRange.max}</Text>
          </View>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={1500}
            step={50}
            value={tempPriceRange.max}
            onValueChange={(val) => setTempPriceRange({ min: 0, max: val })}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor={Colors.borderLight}
            thumbTintColor={Colors.primary}
          />

          <View style={fStyles.sectionRow}>
            <Text style={fStyles.sectionLabel}>CALIFICACIÓN MÍNIMA</Text>
            <Text style={fStyles.sectionValue}>{tempMinRating}+</Text>
          </View>
          <View style={fStyles.starsRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <TouchableOpacity key={i} onPress={() => setTempMinRating(i)}>
                <Ionicons
                  name={i <= tempMinRating ? "star" : "star-outline"}
                  size={wp(28)}
                  color={i <= tempMinRating ? "#F4A536" : Colors.borderLight}
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={fStyles.sectionRow}>
            <Text style={fStyles.sectionLabel}>DISTANCIA MÁXIMA</Text>
            <Text style={fStyles.sectionValue}>{tempMaxDistance} km</Text>
          </View>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={50}
            step={1}
            value={tempMaxDistance}
            onValueChange={(val) => setTempMaxDistance(val)}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor={Colors.borderLight}
            thumbTintColor={Colors.primary}
          />
        </ScrollView>

        <View style={fStyles.footer}>
          <TouchableOpacity style={fStyles.applyBtn} onPress={handleApply}>
            <Text style={fStyles.applyText}>Aplicar filtros</Text>
          </TouchableOpacity>
          <TouchableOpacity style={fStyles.clearBtn} onPress={handleClear}>
            <Text style={fStyles.clearText}>Limpiar todo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function MapModal({
  visible,
  onClose,
  professionals,
  onSelectProfessional,
}: {
  visible: boolean;
  onClose: () => void;
  professionals: any[];
  onSelectProfessional: (id: string) => void;
}) {
  const openInGoogleMaps = (pro: any) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${pro.lat},${pro.lng}`;
    Linking.openURL(url);
  };

  const openInWaze = (pro: any) => {
    const url = `https://waze.com/ul?ll=${pro.lat},${pro.lng}&navigate=yes`;
    Linking.openURL(url);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.mapContainer}>
        <View style={styles.mapHeader}>
          <TouchableOpacity onPress={onClose} style={styles.mapBackBtn}>
            <Ionicons name="arrow-back" size={wp(22)} color={Colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.mapTitle}>Profesionales cerca</Text>
          <View style={styles.mapPlaceholder} />
        </View>

        {Platform.OS !== "web" ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={HONDURAS_CENTER}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {professionals.map((pro) => (
              <Marker
                key={pro.id}
                coordinate={{ latitude: pro.lat, longitude: pro.lng }}
                title={pro.name}
                description={`${pro.specialty} • ${pro.distance} km`}
                onPress={() => {
                  Alert.alert(
                    pro.name,
                    `${pro.specialty}\nDesde $${pro.price}\n${pro.distance} km de ti`,
                    [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: "Reservar",
                        onPress: () => {
                          onClose();
                          onSelectProfessional(pro.id);
                        },
                      },
                    ],
                  );
                }}
              />
            ))}
          </MapView>
        ) : (
          <ScrollView
            style={styles.webMapList}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.webMapPlaceholder}>
              <MaterialCommunityIcons
                name="map-marker-radius"
                size={wp(48)}
                color={Colors.primary}
              />
              <Text style={styles.webMapPlaceholderTitle}>
                Profesionales en el mapa
              </Text>
              <Text style={styles.webMapPlaceholderText}>
                Selecciona un profesional para ver su ubicación en Google Maps o
                Waze
              </Text>
            </View>

            {professionals.map((pro) => (
              <View key={pro.id} style={styles.webMapCard}>
                <View style={styles.webMapCardHeader}>
                  <View>
                    <Text style={styles.webMapCardName}>{pro.name}</Text>
                    <Text style={styles.webMapCardSpecialty}>
                      {pro.specialty}
                    </Text>
                  </View>
                  <View style={styles.webMapCardPrice}>
                    <Text style={styles.webMapCardPriceText}>${pro.price}</Text>
                  </View>
                </View>

                <View style={styles.webMapCardDetails}>
                  <View style={styles.webMapCardDetail}>
                    <Ionicons name="star" size={wp(14)} color="#F4A536" />
                    <Text style={styles.webMapCardDetailText}>
                      {pro.rating}
                    </Text>
                  </View>
                  <View style={styles.webMapCardDetail}>
                    <Ionicons
                      name="location-outline"
                      size={wp(14)}
                      color={Colors.textMedium}
                    />
                    <Text style={styles.webMapCardDetailText}>
                      {pro.distance} km
                    </Text>
                  </View>
                  {pro.online && (
                    <View style={styles.webMapCardOnline}>
                      <View style={styles.webMapCardOnlineDot} />
                      <Text style={styles.webMapCardOnlineText}>En línea</Text>
                    </View>
                  )}
                </View>

                <View style={styles.webMapCardActions}>
                  <TouchableOpacity
                    style={styles.webMapActionBtn}
                    onPress={() => openInGoogleMaps(pro)}
                  >
                    <Ionicons
                      name="map-outline"
                      size={wp(18)}
                      color={Colors.white}
                    />
                    <Text style={styles.webMapActionText}>Google Maps</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.webMapActionBtn, styles.wazeBtn]}
                    onPress={() => openInWaze(pro)}
                  >
                    <MaterialCommunityIcons
                      name="waze"
                      size={wp(18)}
                      color={Colors.white}
                    />
                    <Text style={styles.webMapActionText}>Waze</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.webMapReserveBtn}
                    onPress={() => {
                      onClose();
                      onSelectProfessional(pro.id);
                    }}
                  >
                    <Text style={styles.webMapReserveText}>Reservar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        <View style={styles.mapFooter}>
          <Text style={styles.mapFooterText}>
            {professionals.length} profesionales en esta zona
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export default function BuscarScreen() {
  type Vet = {
    id: string;
    nombre_negocio: string;
    promedio_calificacion: number;
    specialty: string;
    latitud: number;
    longitud: number;
    distance: string;
  };
  const [professionals, setProfessionals] = useState<any[]>([]);
  const lat = 14.1077;
  const lng = -87.2419;
  console.log(professionals);
  const fetchServicios = async () => {
    const res = await fetch(`${API_URL}/api/servicios`);
    return await res.json();
  };
  const fetchData = async () => {
    try {
      const [vetRes, servicios] = await Promise.all([
        fetch(
          `${API_URL}/api/veterinarios/cercanos?latitud=${lat}&longitud=${lng}`,
        ),
        fetchServicios(),
      ]);

      const vets = await vetRes.json();
      const serviciosData = await servicios;

      if (!Array.isArray(vets)) {
        console.log("Vets inválido:", vets);
        setProfessionals([]);
        return;
      }

      if (!Array.isArray(serviciosData)) {
        console.log("Servicios inválido:", serviciosData);
      }

      const mapped = vets.map((v) => {
        const serviciosVet = (serviciosData || []).filter(
          (s: any) => s.veterinario_id === v.id,
        );

        const precios = serviciosVet.map((s: any) => parseFloat(s.precio));

        return {
          id: v.id,
          name: v.nombre_negocio,
          specialty: v.specialty || "General",
          distance:
            typeof v.distance === "string"
              ? parseFloat(v.distance.replace(/[^0-9.]/g, ""))
              : Number(v.distance) || 0,
          rating: v.promedio_calificacion,
          price: precios.length ? Math.min(...precios) : 0,
          lat: v.latitud,
          lng: v.longitud,
          online: true,
        };
      });

      setProfessionals(mapped);
    } catch (error) {
      console.log("ERROR FETCH:", error);
      setProfessionals([]);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],
    priceRange: { min: 0, max: 1500 },
    minRating: 0,
    maxDistance: 150,
  });

  const getProfessionalIcon = (specialty: string) => {
    if (specialty.includes("Veterinario")) return "medical-bag";
    if (specialty.includes("Paseador")) return "walk";
    if (specialty.includes("Peluquería Canina")) return "content-cut";
    if (specialty.includes("Vacunacion")) return "content-cut";
    return "paw";
  };

  const filteredProfessionals = professionals.filter((pro) => {
    const matchesQuery =
      pro.name.toLowerCase().includes(query.toLowerCase()) ||
      pro.specialty.toLowerCase().includes(query.toLowerCase());

    const matchesCategory =
      activeFilters.categories.length === 0 ||
      activeFilters.categories.some((cat) =>
        pro.specialty?.toLowerCase().includes(cat.toLowerCase()),
      );

    const matchesPrice =
      pro.price >= activeFilters.priceRange.min &&
      pro.price <= activeFilters.priceRange.max;

    const matchesRating = pro.rating >= activeFilters.minRating;

    const matchesDistance = pro.distance <= activeFilters.maxDistance;

    return (
      matchesQuery &&
      matchesCategory &&
      matchesPrice &&
      matchesRating &&
      matchesDistance
    );
  });

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
  };

  const handleSelectProfessional = (id: string) => {
    setShowMap(false);
    router.push(`/cliente/citas/agendar?pro=${id}`);
  };

  const hasActiveFilters =
    activeFilters.categories.length > 0 ||
    activeFilters.priceRange.min > 0 ||
    activeFilters.priceRange.max < 500 ||
    activeFilters.minRating > 0 ||
    activeFilters.maxDistance < 50;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Explorar</Text>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search-outline"
            size={wp(18)}
            color={Colors.textLight}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="¿Qué servicio buscas?"
            placeholderTextColor={Colors.placeholder}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons
                name="close-circle"
                size={wp(18)}
                color={Colors.textLight}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.chipsRow}>
        <TouchableOpacity
          style={[styles.chip, hasActiveFilters && styles.chipActive]}
          onPress={() => setShowFilter(true)}
        >
          <Text
            style={[styles.chipText, hasActiveFilters && styles.chipTextActive]}
          >
            Filtros{" "}
            {hasActiveFilters && `(${activeFilters.categories.length || "★"})`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterIconBtn}
          onPress={() => setShowFilter(true)}
        >
          <Ionicons
            name="options-outline"
            size={wp(18)}
            color={Colors.textMedium}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.countRow}>
        <Text style={styles.countText}>
          {filteredProfessionals.length} PROFESIONALES ENCONTRADOS
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {filteredProfessionals.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="search-outline"
              size={wp(56)}
              color={Colors.textLight}
            />
            <Text style={styles.emptyTitle}>Sin resultados</Text>
            <Text style={styles.emptySubtitle}>
              No encontramos profesionales con esos filtros
            </Text>
          </View>
        ) : (
          filteredProfessionals.map((pro) => (
            <TouchableOpacity
              key={pro.id}
              style={styles.proCard}
              activeOpacity={0.8}
              onPress={() => handleSelectProfessional(pro.id)}
            >
              <View style={styles.proAvatarWrapper}>
                <View style={styles.proAvatar}>
                  <MaterialCommunityIcons
                    name={getProfessionalIcon(pro.specialty)}
                    size={wp(28)}
                    color={Colors.primary}
                  />
                </View>
                {pro.online && <View style={styles.onlineDot} />}
              </View>

              <View style={styles.proInfo}>
                <View style={styles.proNameRow}>
                  <Text style={styles.proName}>{pro.name}</Text>
                  <View style={styles.ratingPill}>
                    <Ionicons name="star" size={wp(11)} color="#F4A536" />
                    <Text style={styles.ratingVal}>{pro.rating}</Text>
                  </View>
                </View>
                <Text style={styles.proSpecialty}>{pro.specialty}</Text>
                <View style={styles.proFooter}>
                  <View style={styles.distanceRow}>
                    <Ionicons
                      name="location-outline"
                      size={wp(12)}
                      color={Colors.textMedium}
                    />
                    <Text style={styles.distText}>{pro.distance} km de ti</Text>
                  </View>
                  <Text style={styles.proPrice}>
                    Desde <Text style={styles.proPriceVal}>${pro.price}</Text>
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: hp(80) }} />
      </ScrollView>

      <TouchableOpacity style={styles.mapFab} onPress={() => setShowMap(true)}>
        <Ionicons name="map-outline" size={wp(18)} color={Colors.white} />
        <Text style={styles.mapFabText}>Ver mapa</Text>
      </TouchableOpacity>

      <FilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={handleApplyFilters}
      />

      <MapModal
        visible={showMap}
        onClose={() => setShowMap(false)}
        professionals={filteredProfessionals}
        onSelectProfessional={handleSelectProfessional}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  pageTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: "700",
    color: Colors.textDark,
  },
  searchRow: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md,
    height: hp(48),
    gap: Spacing.sm,
  },
  searchInput: { flex: 1, fontSize: FontSize.md, color: Colors.textDark },
  chipsRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: wp(14),
    paddingVertical: hp(8),
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: {
    fontSize: FontSize.xs,
    color: Colors.textMedium,
    fontWeight: "600",
  },
  chipTextActive: { color: Colors.white },
  filterIconBtn: {
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  countRow: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  countText: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: Colors.textLight,
    letterSpacing: 0.5,
  },
  scroll: { paddingHorizontal: Spacing.lg },
  proCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: wp(10),
    shadowOffset: { width: 0, height: hp(2) },
    elevation: 2,
    gap: Spacing.md,
  },
  proAvatarWrapper: { position: "relative" },
  proAvatar: {
    width: wp(60),
    height: wp(60),
    borderRadius: wp(16),
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  onlineDot: {
    position: "absolute",
    bottom: hp(2),
    right: wp(2),
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  proInfo: { flex: 1 },
  proNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(2),
  },
  proName: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.textDark,
    flex: 1,
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEA",
    borderRadius: Radius.full,
    paddingHorizontal: wp(6),
    paddingVertical: hp(2),
    gap: wp(2),
  },
  ratingVal: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: Colors.textDark,
  },
  proSpecialty: {
    fontSize: FontSize.xs,
    color: Colors.textMedium,
    marginBottom: hp(6),
  },
  proFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  distanceRow: { flexDirection: "row", alignItems: "center", gap: wp(2) },
  distText: { fontSize: FontSize.xs, color: Colors.textMedium },
  proPrice: { fontSize: FontSize.xs, color: Colors.textMedium },
  proPriceVal: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: FontSize.sm,
  },
  mapFab: {
    position: "absolute",
    bottom: hp(24),
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.textDark,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: hp(12),
    gap: Spacing.sm,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: wp(12),
    shadowOffset: { width: 0, height: hp(4) },
    elevation: 8,
  },
  mapFabText: { color: Colors.white, fontSize: FontSize.sm, fontWeight: "700" },
  emptyState: { alignItems: "center", paddingTop: hp(64) },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.textDark,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
    textAlign: "center",
  },
  mapContainer: { flex: 1, backgroundColor: Colors.background },
  mapHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  mapBackBtn: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  mapTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textDark,
  },
  mapPlaceholder: { width: wp(40) },
  map: { flex: 1 },
  mapFooter: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    alignItems: "center",
  },
  mapFooterText: { fontSize: FontSize.sm, color: Colors.textMedium },
  webMapList: { flex: 1, paddingHorizontal: Spacing.lg },
  webMapPlaceholder: {
    alignItems: "center",
    paddingVertical: hp(32),
    backgroundColor: "#F0FAF8",
    borderRadius: Radius.lg,
    marginVertical: Spacing.md,
  },
  webMapPlaceholderTitle: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.textDark,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  webMapPlaceholderText: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
    textAlign: "center",
    paddingHorizontal: Spacing.xl,
  },
  webMapCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: wp(10),
    shadowOffset: { width: 0, height: hp(2) },
    elevation: 2,
  },
  webMapCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  webMapCardName: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.textDark,
    marginBottom: hp(2),
  },
  webMapCardSpecialty: {
    fontSize: FontSize.xs,
    color: Colors.textMedium,
  },
  webMapCardPrice: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
  },
  webMapCardPriceText: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.white,
  },
  webMapCardDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  webMapCardDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(4),
  },
  webMapCardDetailText: {
    fontSize: FontSize.xs,
    color: Colors.textMedium,
  },
  webMapCardOnline: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(4),
  },
  webMapCardOnlineDot: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: "#4CAF50",
  },
  webMapCardOnlineText: {
    fontSize: FontSize.xs,
    color: "#4CAF50",
    fontWeight: "600",
  },
  webMapCardActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  webMapActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: hp(10),
    gap: Spacing.xs,
  },
  wazeBtn: {
    backgroundColor: "#33CCFF",
  },
  webMapActionText: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.white,
  },
  webMapReserveBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingVertical: hp(10),
  },
  webMapReserveText: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: Colors.primary,
  },
});

const fStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  title: { fontSize: FontSize.xxl, fontWeight: "700", color: Colors.textDark },
  closeBtn: {
    width: wp(32),
    height: wp(32),
    borderRadius: wp(16),
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: Colors.textLight,
    letterSpacing: 0.5,
  },
  sectionValue: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.primary,
  },
  categoriesGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "47%",
    paddingVertical: hp(12),
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.white,
    gap: Spacing.sm,
  },
  categoryItemOn: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  checkbox: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(4),
    borderWidth: 2,
    borderColor: Colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  categoryText: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
    fontWeight: "500",
  },
  categoryTextOn: { color: Colors.primary, fontWeight: "700" },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  sliderLabelLeft: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    width: wp(40),
  },
  sliderLabelRight: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    width: wp(40),
    textAlign: "right",
  },
  sliderTrack: {
    flex: 1,
    height: hp(6),
    backgroundColor: Colors.borderLight,
    borderRadius: hp(3),
    position: "relative",
    marginHorizontal: Spacing.sm,
  },
  sliderFill: {
    position: "absolute",
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: hp(3),
  },
  starsRow: { flexDirection: "row", gap: Spacing.sm, marginBottom: Spacing.sm },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    alignItems: "center",
  },
  applyBtn: {
    width: "100%",
    height: hp(54),
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  applyText: { color: Colors.white, fontSize: FontSize.lg, fontWeight: "600" },
  clearBtn: { paddingVertical: Spacing.sm },
  clearText: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
    fontWeight: "500",
  },
});
