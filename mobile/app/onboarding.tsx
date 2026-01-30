import { View, Text, TouchableOpacity, Dimensions, FlatList, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { setOnboardingCompletedThisSession } from "@/lib/onboardingState";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const COLORS = {
  primary: "#005a2b",
  primaryLight: "#0d7a3c",
  gold: "#d4af37",
  goldLight: "#f4e4bc",
  goldDark: "#b8962e",
  white: "#ffffff",
  whiteMuted: "rgba(255, 255, 255, 0.9)",
  whiteSoft: "rgba(255, 255, 255, 0.75)",
};

const slides = [
  {
    id: "1",
    title: "Premium Products",
    subtitle: "What are you looking for?",
    description: "Explore our wide range of premium flooring, tiles, slabs, and building materials. Find the perfect fit for your home or project.",
    icon: "grid-outline",
    image: { uri: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=85" },
    bg: "#005a2b",
  },
  {
    id: "2",
    title: "View in Your Room",
    subtitle: "Our Services",
    description: "See how it looks in your space! Use our 'View in Room' feature to visualize products in your home before you buy.",
    icon: "phone-portrait-outline",
    image: { uri: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=85" },
    bg: "#0d7a3c",
  },
  {
    id: "3",
    title: "Flexible Financing",
    subtitle: "We Offer Financing",
    description: "Make your dream project affordable. We offer flexible financing options so you can get the quality you want with payments that work for you.",
    icon: "card-outline",
    image: { uri: "https://images.unsplash.com/photo-1600596542815-ffad4c1549a9?w=800&q=85" },
    bg: "#005a2b",
  },
  {
    id: "4",
    title: "Expert Support",
    subtitle: "We're Here to Help",
    description: "From selection to installation, our team is with you. Get expert advice, samples, and support every step of the way.",
    icon: "people-outline",
    image: { uri: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=85" },
    bg: "#0d7a3c",
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const completeOnboarding = () => {
    setOnboardingCompletedThisSession(true);
    router.replace("/(auth)");
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderSlide = ({ item }: { item: (typeof slides)[0] }) => (
    <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
      <View style={[styles.slideInner, { backgroundColor: item.bg }]}>
        {/* Hero image with gold-accented frame */}
        <View style={styles.imageWrapper}>
          <Image source={item.image} style={styles.slideImage} contentFit="cover" />
          <View style={styles.imageOverlay} />
          <View style={styles.imageGoldBorder} />
          <View style={styles.iconBadge}>
            <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={28} color={COLORS.goldDark} />
          </View>
        </View>
        {/* Text content with gold accents */}
        <View style={styles.textContent}>
          <Text style={[styles.subtitle, { color: COLORS.goldLight }]}>{item.subtitle}</Text>
          <View style={styles.titleUnderline} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Skip - gold text */}
      <View style={styles.skipWrapper}>
        <TouchableOpacity onPress={completeOnboarding} style={styles.skipButton} activeOpacity={0.8}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Bottom bar - gold accents */}
      <View style={styles.bottomBar}>
        <View style={styles.dotsRow}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  width: currentIndex === index ? 28 : 8,
                  backgroundColor: COLORS.gold,
                  opacity: currentIndex === index ? 1 : 0.4,
                },
              ]}
            />
          ))}
        </View>
        <TouchableOpacity
          onPress={() => {
            if (currentIndex < slides.length - 1) {
              flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
            } else {
              completeOnboarding();
            }
          }}
          style={styles.primaryButton}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>
            {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={COLORS.white} style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  slideInner: {
    flex: 1,
    width: "100%",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
  },
  imageWrapper: {
    width: "100%",
    height: 220,
    position: "relative",
    overflow: "hidden",
  },
  slideImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 90, 43, 0.4)",
  },
  imageGoldBorder: {
    ...StyleSheet.absoluteFillObject,
    borderBottomWidth: 3,
    borderColor: COLORS.gold,
  },
  iconBadge: {
    position: "absolute",
    bottom: 16,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.goldLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.gold,
    shadowColor: COLORS.goldDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  textContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2.5,
    textTransform: "uppercase",
    marginBottom: 6,
    textAlign: "center",
  },
  titleUnderline: {
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.gold,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.whiteSoft,
    textAlign: "center",
    paddingHorizontal: 4,
  },
  skipWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(212, 175, 55, 0.6)",
    backgroundColor: "rgba(212, 175, 55, 0.15)",
  },
  skipText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.gold,
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: "rgba(212, 175, 55, 0.25)",
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.gold,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.goldDark,
    shadowColor: COLORS.goldDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
});
