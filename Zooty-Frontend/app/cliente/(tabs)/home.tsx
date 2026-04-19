import React, { useState, useEffect } from "react";
import { API_URL } from "@/services/api";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius, FontSize } from "@/constants/theme";
import { wp, hp } from "@/constants/Responsive";

const { width, height } = Dimensions.get("window");

// ─── Datos mock (RESTAURADOS) ──────────────────────────────────────────
const PETS = [
  { id: "1", name: "Luna" },
  { id: "2", name: "Max" },
  { id: "3", name: "Rocky" },
];

const SERVICES = [
  {
    id: "1",
    label: "Veterinario",
    sub: "Salud y vacunas",
    color: "#E8F7F5",
    iconBg: Colors.primary,
  },
  {
    id: "2",
    label: "Peluquería",
    sub: "Estética animal",
    color: "#FFF4EE",
    iconBg: "#F4845F",
  },
  {
    id: "3",
    label: "Guardería",
    sub: "Cuidado diario",
    color: "#E8F7F5",
    iconBg: Colors.primary,
  },
  {
    id: "4",
    label: "Paseador",
    sub: "Ejercicio activo",
    color: "#FFF4EE",
    iconBg: "#F4845F",
  },
];

const getSubtitulo = (nombre: string) => {
  switch (nombre) {
    case "Veterinario":
      return "Salud y vacunas";
    case "Peluquería":
      return "Estética animal";
    case "Guardería":
      return "Cuidado diario";
    case "Paseador":
      return "Ejercicio activo";
    default:
      return "Servicios";
  }
};

const getColor = (nombre: string) => {
  switch (nombre) {
    case "Veterinario":
      return "#E8F7F5";
    case "Peluquería":
      return "#FFF4EE";
    case "Guardería":
      return "#E8F7F5";
    case "Paseador":
      return "#FFF4EE";
    default:
      return "#F0F0F0";
  }
};

const getIconBg = (nombre: string) => {
  switch (nombre) {
    case "Veterinario":
      return "#4CAF50";
    case "Peluquería":
      return "#F4845F";
    case "Guardería":
      return "#4CAF50";
    case "Paseador":
      return "#F4845F";
    default:
      return "#999";
  }
};

const PROFESSIONALS = [
  {
    id: "1",
    name: "Clinivet Dr. García",
    specialty: "Medicina General",
    distance: "0.8 km",
    rating: 4.9,
  },
  {
    id: "2",
    name: "Spa Canino Burbujas",
    specialty: "Estética y Baño",
    distance: "1.2 km",
    rating: 4.7,
  },
  {
    id: "3",
    name: "Carlos Paseos",
    specialty: "Paseos grupales",
    distance: "0.5 km",
    rating: 5.0,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [newPetName, setNewPetName] = useState("");
  const [newPetType, setNewPetType] = useState("Perro");
  const [newPetAge, setNewPetAge] = useState("");
  type Pet = {
    id: string;
    nombre: string;
  };

  const [pets, setPets] = useState<Pet[]>([]);
  const fetchPets = async () => {
    try {
      const response = await fetch(`${API_URL}/api/mascotas`);
      const data = await response.json();
      setPets(data);
    } catch (error) {
      console.error("Error fetching pets:", error);
      Alert.alert(
        "Error",
        "No se pudieron cargar tus mascotas. Por favor, intenta de nuevo más tarde.",
      );
    }
  };

  const [professionals, setProfessionals] = useState([]);
  const fetchProfessionals = async () => {
    try {
      const response = await fetch(`${API_URL}/api/veterinarios`);
      const data = await response.json();

      setProfessionals(data);
    } catch (error) {
      console.error(error);
    }
  };

  const [services, setServices] = useState([]);
  const fetchServices = async () => {
    const res = await fetch(`${API_URL}/api/servicios`);
    const data = await res.json();
    setServices(data);
  };

  useEffect(() => {
    fetchPets();
    fetchProfessionals();
    fetchServices();
  }, []);

  const handleAddPet = async () => {
    if (!newPetName.trim()) {
      Alert.alert("Error", "Ingresa nombre");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/mascotas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: newPetName,
          tipo: newPetType,
          edad: newPetAge,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setModalVisible(false);
      setNewPetName("");
      setNewPetType("Perro");
      setNewPetAge("");

      fetchPets(); // 🔥 refrescar lista
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoMini}>
            <Text style={styles.logoMiniText}>Z</Text>
          </View>
          <Text style={styles.brandName}>Zooty</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => router.push("/cliente/perfil/notificaciones")}
          >
            <Text style={styles.notifIcon}>🔔</Text>
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatar}>
            <Text style={styles.avatarText}>U</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Tus mascotas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tus mascotas</Text>
          <TouchableOpacity
            onPress={() => router.push("/cliente/(tabs)/mascotas")}
          >
            <Text style={styles.sectionLink}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.petsRow}
        >
          {/* Añadir mascota */}
          <TouchableOpacity
            style={styles.petAddCard}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.petAddCircle}>
              <Text style={styles.petAddIcon}>+</Text>
            </View>
            <Text style={styles.petName}>Añadir</Text>
          </TouchableOpacity>

          {pets.map((pet) => (
            <TouchableOpacity key={pet.id} style={styles.petCard}>
              <View style={styles.petCircle}>
                <Text style={styles.petInitial}>
                  {pet.nombre.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.petName}>{pet.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Servicios */}
        <View style={styles.servicesGrid}>
          {services.map((svc) => (
            <TouchableOpacity
              key={svc.id}
              style={[
                styles.serviceCard,
                { backgroundColor: getColor(svc.nombre) },
              ]}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.serviceIconCircle,
                  { backgroundColor: getIconBg(svc.nombre) },
                ]}
              >
                <Text style={styles.serviceIcon}>{svc.nombre.charAt(0)}</Text>
              </View>

              <Text style={styles.serviceLabel}>{svc.nombre}</Text>

              <Text style={styles.serviceSub}>
                {getSubtitulo(svc.nombre)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Profesionales cerca */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Profesionales cerca</Text>
          <TouchableOpacity
            onPress={() => router.push("/cliente/(tabs)/buscar")}
          >
            <Text style={styles.sectionLink}>Ver mapa</Text>
          </TouchableOpacity>
        </View>

        {professionals.map((pro) => (
          <TouchableOpacity
            key={pro.id}
            style={styles.proCard}
            activeOpacity={0.8}
            onPress={() => router.push(`/cliente/citas/agendar?pro=${pro.id}`)}
          >
            <View style={styles.proAvatar}>
              <Text style={styles.proAvatarText}>
                {pro.nombre_negocio.charAt(0)}
              </Text>
            </View>
            <View style={styles.proInfo}>
              <View style={styles.proNameRow}>
                <Text style={styles.proName}>{pro.nombre_negocio}</Text>
                <View style={styles.ratingPill}>
                  <Text style={styles.ratingStar}>★</Text>
                  <Text style={styles.ratingValue}>
                    {pro.promedio_calificacion}
                  </Text>
                </View>
              </View>
              <Text style={styles.proSpecialty}>{pro.specialty}</Text>
              <View style={styles.proDistanceRow}>
                <Text style={styles.distanceIcon}>📍</Text>
                <Text style={styles.proDistance}>{pro.distance}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.reserveBtn}
              onPress={() =>
                router.push(`/cliente/citas/agendar?pro=${pro.id}`)
              }
            >
              <Text style={styles.reserveBtnText}>Reservar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <View style={{ height: hp(16) }} />
      </ScrollView>

      {/* Modal mejorado */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalContainer}
              >
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Nueva mascota</Text>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.modalCloseBtn}
                    >
                      <Text style={styles.modalClose}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.modalScroll}
                  >
                    <View style={styles.modalBody}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Nombre *</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Ej: Luna, Max, Rocky"
                          placeholderTextColor={Colors.placeholder}
                          value={newPetName}
                          onChangeText={setNewPetName}
                          autoFocus={true}
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Tipo</Text>
                        <View style={styles.typeButtons}>
                          {["Perro", "Gato", "Otro"].map((type) => (
                            <TouchableOpacity
                              key={type}
                              style={[
                                styles.typeButton,
                                newPetType === type && styles.typeButtonActive,
                              ]}
                              onPress={() => setNewPetType(type)}
                            >
                              <Text
                                style={[
                                  styles.typeButtonText,
                                  newPetType === type &&
                                    styles.typeButtonTextActive,
                                ]}
                              >
                                {type}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Edad (opcional)</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Ej: 2 años, 3 meses"
                          placeholderTextColor={Colors.placeholder}
                          value={newPetAge}
                          onChangeText={setNewPetAge}
                        />
                      </View>
                    </View>
                  </ScrollView>

                  <View style={styles.modalFooter}>
                    <TouchableOpacity
                      style={styles.modalButtonCancel}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.modalButtonCancelText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalButtonSave}
                      onPress={handleAddPet}
                    >
                      <Text style={styles.modalButtonSaveText}>Guardar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: hp(24) },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.background,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  logoMini: {
    width: wp(32),
    height: wp(32),
    borderRadius: wp(16),
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  logoMiniText: { color: Colors.primary, fontWeight: "800", fontSize: wp(16) },
  brandName: {
    fontSize: FontSize.xl,
    fontWeight: "800",
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  notifBtn: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: wp(6),
    shadowOffset: { width: 0, height: hp(2) },
    elevation: 2,
    position: "relative",
  },
  notifIcon: { fontSize: wp(18) },
  notifBadge: {
    position: "absolute",
    top: hp(4),
    right: wp(4),
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  notifBadgeText: { color: Colors.white, fontSize: wp(8), fontWeight: "700" },
  avatar: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatarText: { fontSize: wp(18), fontWeight: "600", color: Colors.primary },

  /* Sección */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textDark,
  },
  sectionLink: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: "600",
  },

  /* Mascotas */
  petsRow: {
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  petCard: { alignItems: "center", marginRight: Spacing.lg },
  petAddCard: { alignItems: "center", marginRight: Spacing.lg },
  petCircle: {
    width: wp(60),
    height: wp(60),
    borderRadius: wp(30),
    backgroundColor: Colors.white,
    borderWidth: 2.5,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: wp(6),
    shadowOffset: { width: 0, height: hp(2) },
    elevation: 2,
    marginBottom: hp(6),
  },
  petInitial: { fontSize: wp(28), fontWeight: "600", color: Colors.primary },
  petAddCircle: {
    width: wp(60),
    height: wp(60),
    borderRadius: wp(30),
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(6),
  },
  petAddIcon: { fontSize: wp(30), color: Colors.textLight, fontWeight: "300" },
  petName: {
    fontSize: FontSize.xs,
    color: Colors.textMedium,
    fontWeight: "600",
  },

  /* Servicios */
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  serviceCard: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: wp(8),
    shadowOffset: { width: 0, height: hp(2) },
    elevation: 1,
  },
  serviceIconCircle: {
    width: wp(44),
    height: wp(44),
    borderRadius: wp(14),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(10),
  },
  serviceIcon: { fontSize: wp(22), fontWeight: "600", color: Colors.white },
  serviceLabel: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.textDark,
    marginBottom: hp(2),
  },
  serviceSub: { fontSize: FontSize.xs, color: Colors.textMedium },

  /* Profesionales */
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
  proAvatar: {
    width: wp(56),
    height: wp(56),
    borderRadius: wp(16),
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  proAvatarText: { fontSize: wp(24), fontWeight: "600", color: Colors.primary },
  proInfo: { flex: 1 },
  proNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(2),
  },
  proName: {
    fontSize: FontSize.sm,
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
  ratingStar: { color: "#F4A536", fontSize: wp(11) },
  ratingValue: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: Colors.textDark,
  },
  proSpecialty: {
    fontSize: FontSize.xs,
    color: Colors.textMedium,
    marginBottom: hp(4),
  },
  proDistanceRow: { flexDirection: "row", alignItems: "center", gap: wp(2) },
  distanceIcon: { fontSize: wp(11) },
  proDistance: { fontSize: FontSize.xs, color: Colors.textMedium },
  reserveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: wp(14),
    paddingVertical: hp(8),
  },
  reserveBtnText: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: "700",
  },

  /* Modal mejorado */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width - Spacing.xl * 2,
    maxWidth: wp(400),
    maxHeight: height * 0.7,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textDark,
  },
  modalCloseBtn: {
    width: wp(32),
    height: wp(32),
    borderRadius: wp(16),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  modalClose: {
    fontSize: wp(18),
    color: Colors.textMedium,
    fontWeight: "400",
  },
  modalScroll: {
    flexGrow: 1,
  },
  modalBody: {
    padding: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textDark,
    marginBottom: hp(6),
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === "ios" ? hp(14) : hp(10),
    fontSize: FontSize.md,
    color: Colors.textDark,
  },
  typeButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  typeButton: {
    flex: 1,
    paddingVertical: hp(10),
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  typeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeButtonText: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
    fontWeight: "500",
  },
  typeButtonTextActive: {
    color: Colors.white,
  },
  modalFooter: {
    flexDirection: "row",
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: hp(12),
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  modalButtonCancelText: {
    fontSize: FontSize.md,
    color: Colors.textMedium,
    fontWeight: "600",
  },
  modalButtonSave: {
    flex: 1,
    paddingVertical: hp(12),
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  modalButtonSaveText: {
    fontSize: FontSize.md,
    color: Colors.white,
    fontWeight: "600",
  },
});
