import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, TextInput,
  Alert, Platform, Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';
import PrimaryButton from '@/components/PrimaryButton';

type BankType = 'national' | 'international';
type AccountType = 'savings' | 'checking';

interface BankAccount {
  id: string;
  bankName: string;
  accountType: AccountType;
  accountNumber: string;
  isDefault: boolean;
}

export default function ConfigurarRetiroScreen() {
  const router = useRouter();
  
  const [selectedBankType, setSelectedBankType] = useState<BankType>('national');
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType>('savings');
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estado para cuentas guardadas
  const [savedAccounts, setSavedAccounts] = useState<BankAccount[]>([
    { id: '1', bankName: 'Banco Estado', accountType: 'savings', accountNumber: '****4567', isDefault: true },
  ]);
  
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<BankAccount | null>(null);

  const formatRut = (text: string) => {
    let cleaned = text.replace(/[^0-9kK]/g, '');
    if (cleaned.length > 1) {
      const body = cleaned.slice(0, -1);
      const dv = cleaned.slice(-1);
      return body.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;
    }
    return cleaned;
  };

  const formatAccountNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    return cleaned.replace(/\B(?=(\d{4})+(?!\d))/g, ' ');
  };

  const validateForm = () => {
    if (!bankName.trim()) {
      Alert.alert('Error', 'Selecciona un banco');
      return false;
    }
    if (!accountHolder.trim()) {
      Alert.alert('Error', 'Ingresa el nombre del titular');
      return false;
    }
    if (!rut.trim()) {
      Alert.alert('Error', 'Ingresa tu RUT');
      return false;
    }
    if (accountNumber.length < 10) {
      Alert.alert('Error', 'Ingresa un número de cuenta válido');
      return false;
    }
    if (accountNumber !== confirmAccountNumber) {
      Alert.alert('Error', 'Los números de cuenta no coinciden');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Ingresa un correo electrónico válido');
      return false;
    }
    return true;
  };

  const handleSaveAccount = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    
    const newAccount: BankAccount = {
      id: Date.now().toString(),
      bankName,
      accountType: selectedAccountType,
      accountNumber: '****' + accountNumber.slice(-4),
      isDefault: savedAccounts.length === 0,
    };
    
    setSavedAccounts([...savedAccounts, newAccount]);
    
    Alert.alert(
      '¡Cuenta agregada!',
      'Tu cuenta bancaria ha sido registrada exitosamente.',
      [
        {
          text: 'Aceptar',
          onPress: () => {
            setShowAddAccount(false);
            resetForm();
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setBankName('');
    setAccountHolder('');
    setAccountNumber('');
    setConfirmAccountNumber('');
    setRut('');
    setEmail('');
    setSelectedBankType('national');
    setSelectedAccountType('savings');
  };

  const handleSetDefault = (accountId: string) => {
    setSavedAccounts(prev => prev.map(acc => ({
      ...acc,
      isDefault: acc.id === accountId,
    })));
  };

  const handleDeleteAccount = (account: BankAccount) => {
    setAccountToDelete(account);
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    if (!accountToDelete) return;
    
    setSavedAccounts(prev => prev.filter(acc => acc.id !== accountToDelete.id));
    setShowDeleteModal(false);
    setAccountToDelete(null);
    
    Alert.alert('Cuenta eliminada', 'La cuenta bancaria ha sido eliminada.');
  };

  const BANKS = [
    'Banco Estado', 'Banco de Chile', 'Santander', 'BCI', 'Scotiabank',
    'Itaú', 'BICE', 'Security', 'Falabella', 'Ripley',
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView 
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={wp(22)} color={Colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Configurar retiro</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Saldo disponible */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo disponible para retiro</Text>
          <Text style={styles.balanceAmount}>$485.200</Text>
          <View style={styles.balanceInfo}>
            <Ionicons name="information-circle-outline" size={wp(16)} color={Colors.textLight} />
            <Text style={styles.balanceInfoText}>
              Los retiros se procesan los días viernes
            </Text>
          </View>
        </View>

        {/* Cuentas guardadas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mis cuentas bancarias</Text>
          <TouchableOpacity onPress={() => setShowAddAccount(true)}>
            <Ionicons name="add-circle" size={wp(28)} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {savedAccounts.length > 0 ? (
          savedAccounts.map((account) => (
            <View key={account.id} style={styles.accountCard}>
              <View style={styles.accountIcon}>
                <MaterialCommunityIcons name="bank" size={wp(24)} color={Colors.primary} />
              </View>
              <View style={styles.accountInfo}>
                <View style={styles.accountHeader}>
                  <Text style={styles.accountBank}>{account.bankName}</Text>
                  {account.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Principal</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.accountType}>
                  {account.accountType === 'savings' ? 'Cuenta de Ahorro' : 'Cuenta Corriente'}
                </Text>
                <Text style={styles.accountNumber}>{account.accountNumber}</Text>
              </View>
              <View style={styles.accountActions}>
                {!account.isDefault && (
                  <TouchableOpacity 
                    style={styles.accountAction}
                    onPress={() => handleSetDefault(account.id)}
                  >
                    <Ionicons name="star-outline" size={wp(20)} color={Colors.textLight} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={styles.accountAction}
                  onPress={() => handleDeleteAccount(account)}
                >
                  <Ionicons name="trash-outline" size={wp(20)} color={Colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="bank-outline" size={wp(48)} color={Colors.textLight} />
            <Text style={styles.emptyText}>No tienes cuentas registradas</Text>
            <Text style={styles.emptySubtext}>
              Agrega una cuenta bancaria para recibir tus pagos
            </Text>
          </View>
        )}

        {/* Información importante */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Información importante</Text>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={wp(18)} color={Colors.primary} />
            <Text style={styles.infoItemText}>
              Los retiros se procesan en 24-48 horas hábiles
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="cash-outline" size={wp(18)} color={Colors.primary} />
            <Text style={styles.infoItemText}>
              Monto mínimo de retiro: $10.000
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark-outline" size={wp(18)} color={Colors.primary} />
            <Text style={styles.infoItemText}>
              Tus datos bancarios están encriptados y seguros
            </Text>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Botón solicitar retiro */}
      {savedAccounts.length > 0 && (
        <View style={styles.bottomBar}>
          <PrimaryButton 
            label="Solicitar retiro" 
            onPress={() => {
              Alert.alert(
                'Solicitar retiro',
                '¿Deseas solicitar el retiro de tu saldo disponible?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { 
                    text: 'Solicitar', 
                    onPress: () => Alert.alert('Solicitud enviada', 'Tu solicitud de retiro ha sido recibida.')
                  }
                ]
              );
            }}
          />
        </View>
      )}

      {/* Modal para agregar cuenta */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddAccount}
        onRequestClose={() => setShowAddAccount(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agregar cuenta bancaria</Text>
              <TouchableOpacity 
                onPress={() => {
                  setShowAddAccount(false);
                  resetForm();
                }}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={wp(24)} color={Colors.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalBody}>
                {/* Tipo de banco */}
                <Text style={styles.inputLabel}>Tipo de banco</Text>
                <View style={styles.bankTypeRow}>
                  <TouchableOpacity
                    style={[
                      styles.bankTypeBtn,
                      selectedBankType === 'national' && styles.bankTypeBtnActive
                    ]}
                    onPress={() => setSelectedBankType('national')}
                  >
                    <Text style={[
                      styles.bankTypeText,
                      selectedBankType === 'national' && styles.bankTypeTextActive
                    ]}>Nacional</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.bankTypeBtn,
                      selectedBankType === 'international' && styles.bankTypeBtnActive
                    ]}
                    onPress={() => setSelectedBankType('international')}
                  >
                    <Text style={[
                      styles.bankTypeText,
                      selectedBankType === 'international' && styles.bankTypeTextActive
                    ]}>Internacional</Text>
                  </TouchableOpacity>
                </View>

                {/* Selección de banco */}
                <Text style={styles.inputLabel}>Banco</Text>
                <View style={styles.bankList}>
                  {BANKS.map((bank) => (
                    <TouchableOpacity
                      key={bank}
                      style={[
                        styles.bankOption,
                        bankName === bank && styles.bankOptionSelected
                      ]}
                      onPress={() => setBankName(bank)}
                    >
                      <Text style={[
                        styles.bankOptionText,
                        bankName === bank && styles.bankOptionTextSelected
                      ]}>{bank}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Tipo de cuenta */}
                <Text style={styles.inputLabel}>Tipo de cuenta</Text>
                <View style={styles.accountTypeRow}>
                  <TouchableOpacity
                    style={[
                      styles.accountTypeBtn,
                      selectedAccountType === 'savings' && styles.accountTypeBtnActive
                    ]}
                    onPress={() => setSelectedAccountType('savings')}
                  >
                    <Text style={[
                      styles.accountTypeText,
                      selectedAccountType === 'savings' && styles.accountTypeTextActive
                    ]}>Ahorro</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.accountTypeBtn,
                      selectedAccountType === 'checking' && styles.accountTypeBtnActive
                    ]}
                    onPress={() => setSelectedAccountType('checking')}
                  >
                    <Text style={[
                      styles.accountTypeText,
                      selectedAccountType === 'checking' && styles.accountTypeTextActive
                    ]}>Corriente</Text>
                  </TouchableOpacity>
                </View>

                {/* Nombre del titular */}
                <Text style={styles.inputLabel}>Nombre del titular</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Como aparece en la cuenta"
                  placeholderTextColor={Colors.placeholder}
                  value={accountHolder}
                  onChangeText={setAccountHolder}
                  autoCapitalize="words"
                />

                {/* RUT */}
                <Text style={styles.inputLabel}>RUT</Text>
                <TextInput
                  style={styles.input}
                  placeholder="12.345.678-9"
                  placeholderTextColor={Colors.placeholder}
                  value={rut}
                  onChangeText={(text) => setRut(formatRut(text))}
                  keyboardType="numeric"
                  maxLength={12}
                />

                {/* Número de cuenta */}
                <Text style={styles.inputLabel}>Número de cuenta</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0000 0000 0000 0000"
                  placeholderTextColor={Colors.placeholder}
                  value={accountNumber}
                  onChangeText={(text) => setAccountNumber(formatAccountNumber(text))}
                  keyboardType="numeric"
                  maxLength={24}
                />

                {/* Confirmar número de cuenta */}
                <Text style={styles.inputLabel}>Confirmar número de cuenta</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirma el número de cuenta"
                  placeholderTextColor={Colors.placeholder}
                  value={confirmAccountNumber}
                  onChangeText={(text) => setConfirmAccountNumber(formatAccountNumber(text))}
                  keyboardType="numeric"
                  maxLength={24}
                />

                {/* Email para notificaciones */}
                <Text style={styles.inputLabel}>Correo electrónico</Text>
                <TextInput
                  style={styles.input}
                  placeholder="tu@correo.com"
                  placeholderTextColor={Colors.placeholder}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalButtonCancel}
                onPress={() => {
                  setShowAddAccount(false);
                  resetForm();
                }}
              >
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButtonSave}
                onPress={handleSaveAccount}
                disabled={loading}
              >
                <Text style={styles.modalButtonSaveText}>
                  {loading ? 'Guardando...' : 'Guardar cuenta'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmación para eliminar cuenta */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmModalContent}>
            <View style={styles.confirmModalIcon}>
              <Ionicons name="warning-outline" size={wp(48)} color={Colors.error} />
            </View>
            
            <Text style={styles.confirmModalTitle}>¿Eliminar cuenta?</Text>
            
            {accountToDelete && (
              <View style={styles.confirmModalInfo}>
                <Text style={styles.confirmModalBank}>{accountToDelete.bankName}</Text>
                <Text style={styles.confirmModalNumber}>{accountToDelete.accountNumber}</Text>
              </View>
            )}
            
            <Text style={styles.confirmModalDescription}>
              Esta acción no se puede deshacer. ¿Deseas continuar?
            </Text>

            <View style={styles.confirmModalActions}>
              <TouchableOpacity 
                style={styles.confirmModalCancelBtn}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.confirmModalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmModalDeleteBtn}
                onPress={confirmDeleteAccount}
              >
                <Text style={styles.confirmModalDeleteText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: hp(20) },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? 0 : Spacing.md,
    marginBottom: Spacing.md,
  },
  backBtn: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textDark,
  },
  placeholder: { width: wp(40) },
  
  balanceCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  balanceLabel: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: hp(4),
  },
  balanceAmount: {
    fontSize: wp(42),
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -1,
    marginBottom: Spacing.md,
  },
  balanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(6),
  },
  balanceInfoText: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.8)',
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textDark,
  },
  
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  accountIcon: {
    width: wp(48),
    height: wp(48),
    borderRadius: wp(12),
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountInfo: { flex: 1 },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: hp(2),
  },
  accountBank: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textDark,
  },
  defaultBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: wp(8),
    paddingVertical: hp(2),
  },
  defaultBadgeText: {
    fontSize: wp(9),
    color: Colors.primary,
    fontWeight: '600',
  },
  accountType: {
    fontSize: FontSize.xs,
    color: Colors.textMedium,
    marginBottom: hp(2),
  },
  accountNumber: {
    fontSize: FontSize.sm,
    color: Colors.textDark,
    fontWeight: '500',
  },
  accountActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  accountAction: {
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  emptyState: {
    alignItems: 'center',
    paddingVertical: hp(40),
  },
  emptyText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textDark,
    marginTop: Spacing.md,
    marginBottom: hp(4),
  },
  emptySubtext: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
    textAlign: 'center',
  },
  
  infoCard: {
    backgroundColor: '#F0FAF8',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.xl,
  },
  infoTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: hp(10),
  },
  infoItemText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textDark,
  },
  
  spacer: { height: hp(20) },
  
  bottomBar: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? hp(30) : Spacing.lg,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textDark,
  },
  modalCloseBtn: {
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  modalBody: {
    padding: Spacing.lg,
  },
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: hp(6),
    marginTop: Spacing.md,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? hp(14) : hp(10),
    fontSize: FontSize.md,
    color: Colors.textDark,
  },
  bankTypeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  bankTypeBtn: {
    flex: 1,
    paddingVertical: hp(12),
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  bankTypeBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  bankTypeText: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
    fontWeight: '500',
  },
  bankTypeTextActive: {
    color: Colors.white,
  },
  bankList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  bankOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: hp(10),
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
  },
  bankOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  bankOptionText: {
    fontSize: FontSize.sm,
    color: Colors.textDark,
  },
  bankOptionTextSelected: {
    color: Colors.white,
    fontWeight: '600',
  },
  accountTypeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  accountTypeBtn: {
    flex: 1,
    paddingVertical: hp(12),
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  accountTypeBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  accountTypeText: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
    fontWeight: '500',
  },
  accountTypeTextActive: {
    color: Colors.white,
  },
  modalFooter: {
    flexDirection: 'row',
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
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  modalButtonCancelText: {
    fontSize: FontSize.md,
    color: Colors.textMedium,
    fontWeight: '600',
  },
  modalButtonSave: {
    flex: 1,
    paddingVertical: hp(12),
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  modalButtonSaveText: {
    fontSize: FontSize.md,
    color: Colors.white,
    fontWeight: '600',
  },
  
  // Confirm modal
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  confirmModalContent: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: wp(400),
  },
  confirmModalIcon: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  confirmModalTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  confirmModalInfo: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  confirmModalBank: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: hp(2),
  },
  confirmModalNumber: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
  },
  confirmModalDescription: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
    textAlign: 'center',
    lineHeight: hp(20),
    marginBottom: Spacing.xl,
  },
  confirmModalActions: {
    gap: Spacing.sm,
  },
  confirmModalCancelBtn: {
    paddingVertical: hp(12),
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    alignItems: 'center',
  },
  confirmModalCancelText: {
    fontSize: FontSize.md,
    color: Colors.textMedium,
    fontWeight: '600',
  },
  confirmModalDeleteBtn: {
    paddingVertical: hp(12),
    borderRadius: Radius.full,
    backgroundColor: Colors.error,
    alignItems: 'center',
  },
  confirmModalDeleteText: {
    fontSize: FontSize.md,
    color: Colors.white,
    fontWeight: '600',
  },
});