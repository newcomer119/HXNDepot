import SafeScreen from "@/components/SafeScreen";
import { useApi } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const COLORS = {
  primary: "#005a2b",
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  white: "#ffffff",
};

const CATEGORIES = [
  "Installer",
  "Constructor",
  "Real Estate Agent",
  "Interior Designer",
  "Flooring Specialist",
  "Tile Installer",
  "General Contractor",
  "Plumber",
  "Electrician",
  "Painter",
  "Other",
];

type Freelancer = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  experienceYears?: number;
  serviceArea?: string;
  description?: string;
};

const PLACEHOLDER_PROS: Freelancer[] = [
  { _id: "p1", name: "Alex Chen", category: "Flooring Specialist", serviceArea: "Toronto GTA", experienceYears: 8, description: "Premium hardwood and tile installation.", email: "alex@example.com", phone: "+14165550100" },
  { _id: "p2", name: "Maria Santos", category: "Interior Designer", serviceArea: "Ontario", experienceYears: 12, description: "Residential and commercial design.", email: "maria@example.com", phone: "+14165550101" },
  { _id: "p3", name: "James Wilson", category: "General Contractor", serviceArea: "Greater Toronto", experienceYears: 15, description: "Full renovation and construction.", email: "james@example.com", phone: "+14165550102" },
];

export default function FreelancersScreen() {
  const api = useApi();
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    experienceYears: "",
    serviceArea: "",
    description: "",
  });

  const fetchFreelancers = useCallback(async () => {
    try {
      const url = categoryFilter ? `/freelancer/list?category=${encodeURIComponent(categoryFilter)}` : "/freelancer/list";
      const { data } = await api.get<{ success: boolean; freelancers: Freelancer[] }>(url);
      if (data.success && data.freelancers?.length) {
        setFreelancers(data.freelancers);
      } else {
        setFreelancers(PLACEHOLDER_PROS);
      }
    } catch {
      setFreelancers(PLACEHOLDER_PROS);
    } finally {
      setLoading(false);
    }
  }, [api, categoryFilter]);

  useEffect(() => {
    fetchFreelancers();
  }, [fetchFreelancers]);

  const onRegister = async () => {
    if (!form.name || !form.email || !form.phone || !form.category) return;
    setSubmitting(true);
    try {
      const { data } = await api.post<{ success: boolean; message?: string }>("/freelancer/register", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        category: form.category,
        experienceYears: form.experienceYears ? Number(form.experienceYears) : undefined,
        serviceArea: form.serviceArea || undefined,
        description: form.description || undefined,
      });
      if (data.success) {
        setModalOpen(false);
        setForm({ name: "", email: "", phone: "", category: "", experienceYears: "", serviceArea: "", description: "" });
        fetchFreelancers();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <View style={styles.accentLine} />
              <Text style={styles.headerLabel}>FIND A PRO</Text>
              <Text style={styles.headerTitle}>Installers & Professionals</Text>
              <Text style={styles.headerSubtitle}>
                Connect with vetted installers, constructors, and real estate professionals. Register to be listed in our directory.
              </Text>
            </View>
            <View style={{ width: 44 }} />
          </View>
        </View>

        {/* Primary CTA */}
        <View style={styles.ctaSection}>
          <TouchableOpacity onPress={() => setModalOpen(true)} style={styles.primaryCta} activeOpacity={0.88}>
            <View style={styles.primaryCtaIcon}>
              <Ionicons name="person-add" size={24} color={COLORS.white} />
            </View>
            <Text style={styles.primaryCtaText}>Register as a Professional</Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.white} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>

        {/* Category filter section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Filter by category</Text>
            {categoryFilter ? (
              <TouchableOpacity onPress={() => setCategoryFilter("")}>
                <Text style={styles.clearFilter}>Clear</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategoryFilter(cat)}
                style={[styles.chip, categoryFilter === cat && styles.chipActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, categoryFilter === cat && styles.chipTextActive]} numberOfLines={1}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Professionals list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured professionals</Text>
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading professionals...</Text>
            </View>
          ) : (
            <View style={styles.cardsWrap}>
              {freelancers.map((pro) => (
                <View key={pro._id} style={styles.card}>
                  <View style={styles.cardAccent} />
                  <View style={styles.cardInner}>
                    <View style={styles.cardHeader}>
                      <View style={styles.iconWrap}>
                        <Ionicons name="briefcase" size={26} color={COLORS.primary} />
                      </View>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{pro.category}</Text>
                      </View>
                    </View>
                    <Text style={styles.name}>{pro.name}</Text>
                    {pro.experienceYears != null && (
                      <Text style={styles.metaText}>{pro.experienceYears} years experience</Text>
                    )}
                    {pro.description ? (
                      <Text style={styles.descText} numberOfLines={2}>{pro.description}</Text>
                    ) : null}
                    {pro.serviceArea ? (
                      <View style={styles.locationRow}>
                        <Ionicons name="location" size={16} color={COLORS.gold} />
                        <Text style={styles.locationText}>{pro.serviceArea}</Text>
                      </View>
                    ) : null}
                    <View style={styles.cardActions}>
                      <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL(`mailto:${pro.email}`)} activeOpacity={0.8}>
                        <Ionicons name="mail-outline" size={18} color={COLORS.primary} />
                        <Text style={styles.actionBtnText}>Email</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL(`tel:${pro.phone}`)} activeOpacity={0.8}>
                        <Ionicons name="call-outline" size={18} color={COLORS.primary} />
                        <Text style={styles.actionBtnText}>Call</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Bottom CTA */}
        <View style={styles.bottomCtaSection}>
          <View style={styles.bottomCtaLine} />
          <Text style={styles.bottomCtaTitle}>Are you an installer or contractor?</Text>
          <Text style={styles.bottomCtaSubtitle}>Join our directory and get discovered by customers.</Text>
          <TouchableOpacity onPress={() => setModalOpen(true)} style={styles.secondaryCta} activeOpacity={0.88}>
            <Text style={styles.secondaryCtaText}>Register to be listed</Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={modalOpen} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View className="flex-row items-center justify-between mb-6">
              <Text style={styles.modalTitle}>Register as a Pro</Text>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <Ionicons name="close" size={28} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                value={form.name}
                onChangeText={(t) => setForm((f) => ({ ...f, name: t }))}
                placeholder="John Smith"
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />
              <Text style={styles.label}>Email *</Text>
              <TextInput
                value={form.email}
                onChangeText={(t) => setForm((f) => ({ ...f, email: t }))}
                placeholder="email@example.com"
                keyboardType="email-address"
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />
              <Text style={styles.label}>Phone *</Text>
              <TextInput
                value={form.phone}
                onChangeText={(t) => setForm((f) => ({ ...f, phone: t }))}
                placeholder="+1 (555) 000-0000"
                keyboardType="phone-pad"
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />
              <Text style={styles.label}>Category *</Text>
              <View style={styles.selectWrap}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setForm((f) => ({ ...f, category: cat }))}
                      style={[styles.optionChip, form.category === cat && styles.optionChipActive]}
                    >
                      <Text style={[styles.optionChipText, form.category === cat && styles.optionChipTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <Text style={styles.label}>Years of experience</Text>
              <TextInput
                value={form.experienceYears}
                onChangeText={(t) => setForm((f) => ({ ...f, experienceYears: t }))}
                placeholder="e.g. 5"
                keyboardType="number-pad"
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />
              <Text style={styles.label}>Service area</Text>
              <TextInput
                value={form.serviceArea}
                onChangeText={(t) => setForm((f) => ({ ...f, serviceArea: t }))}
                placeholder="e.g. Toronto GTA"
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />
              <Text style={styles.label}>Short description (optional)</Text>
              <TextInput
                value={form.description}
                onChangeText={(t) => setForm((f) => ({ ...f, description: t }))}
                placeholder="Services you offer..."
                multiline
                numberOfLines={3}
                style={[styles.input, styles.textArea]}
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                onPress={onRegister}
                disabled={submitting || !form.name || !form.email || !form.phone || !form.category}
                style={[styles.submitBtn, (!form.name || !form.email || !form.phone || !form.category) && styles.submitBtnDisabled]}
              >
                {submitting ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.submitBtnText}>Register as Pro</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: COLORS.white,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${COLORS.primary}08`,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  accentLine: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.gold,
    marginBottom: 10,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.8,
    color: COLORS.gold,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6b7280",
  },
  ctaSection: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  primaryCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryCtaIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  primaryCtaText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
    color: COLORS.primary,
  },
  clearFilter: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.gold,
  },
  chipsScroll: {
    paddingRight: 24,
    gap: 10,
    flexDirection: "row",
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: { color: COLORS.primary, fontWeight: "700", fontSize: 13, maxWidth: 140 },
  chipTextActive: { color: COLORS.white },
  loadingWrap: {
    paddingVertical: 48,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "600",
  },
  cardsWrap: {
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardAccent: {
    height: 4,
    width: "100%",
    backgroundColor: COLORS.gold,
  },
  cardInner: {
    padding: 22,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: `${COLORS.gold}20`,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: `${COLORS.gold}40`,
  },
  badge: {
    backgroundColor: `${COLORS.gold}25`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgeText: { color: COLORS.primary, fontWeight: "800", fontSize: 12 },
  name: { fontSize: 20, fontWeight: "800", color: COLORS.primary, marginBottom: 6 },
  metaText: { fontSize: 14, color: "#6b7280", marginBottom: 8, fontWeight: "600" },
  descText: { fontSize: 14, lineHeight: 20, color: "#6b7280", marginBottom: 10 },
  locationRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  locationText: { fontSize: 14, color: "#6b7280", marginLeft: 6, fontWeight: "500" },
  cardActions: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: `${COLORS.primary}08`,
    borderWidth: 1,
    borderColor: `${COLORS.primary}20`,
  },
  actionBtnText: { color: COLORS.primary, fontWeight: "700", fontSize: 14, marginLeft: 8 },
  bottomCtaSection: {
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 32,
    paddingVertical: 28,
    paddingHorizontal: 24,
    backgroundColor: `${COLORS.gold}12`,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: `${COLORS.gold}30`,
    alignItems: "center",
  },
  bottomCtaLine: {
    width: 48,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.gold,
    marginBottom: 16,
  },
  bottomCtaTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 6,
    textAlign: "center",
  },
  bottomCtaSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 18,
    textAlign: "center",
    lineHeight: 20,
  },
  secondaryCta: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.gold,
    backgroundColor: COLORS.white,
  },
  secondaryCtaText: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.primary,
    marginRight: 8,
  },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    maxHeight: "90%",
    borderTopWidth: 4,
    borderTopColor: COLORS.gold,
  },
  modalTitle: { fontSize: 22, fontWeight: "800", color: COLORS.primary },
  label: { fontSize: 13, fontWeight: "700", color: COLORS.primary, marginBottom: 8, marginTop: 16, letterSpacing: 0.3 },
  input: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  textArea: { minHeight: 88, textAlignVertical: "top" },
  selectWrap: { marginBottom: 8 },
  optionChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 2, borderColor: COLORS.gold, marginRight: 10 },
  optionChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  optionChipText: { color: COLORS.primary, fontWeight: "700", fontSize: 13 },
  optionChipTextActive: { color: COLORS.white },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 28,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: COLORS.white, fontWeight: "800", fontSize: 16, letterSpacing: 0.3 },
});
