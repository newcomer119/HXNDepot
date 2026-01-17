import SafeScreen from "@/components/SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, Linking } from "react-native";

const ContactScreen = () => {
  const handlePhoneCall = () => {
    Linking.openURL("tel:+15197066111");
  };

  const handleEmail = () => {
    Linking.openURL("mailto:infohxnbuildingdepot.ca");
  };

  const handleMap = () => {
    const address = "1734 Orangebrook Ct, Pickering, ON L1W 3G8";
    Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
  };

  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="px-6 pt-6 pb-4 bg-background">
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity
              className="bg-surface/50 p-3 rounded-full"
              activeOpacity={0.7}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={22} color={"#005a2b"} />
            </TouchableOpacity>
            <Text className="text-text-primary text-2xl font-bold">Contact Us</Text>
            <View style={{ width: 40 }} />
          </View>
        </View>

        <View className="px-6">
          {/* Contact Form Section */}
          <View className="mb-8">
            <Text className="text-text-primary text-3xl font-black mb-2">Get in Touch</Text>
            <View className="h-1 w-20 bg-gold mb-6" />
            <Text className="text-text-secondary text-base leading-6 mb-6">
              Have questions or need assistance? We're here to help! Reach out to us through any of the methods below.
            </Text>
          </View>

          {/* Contact Information Cards */}
          <View className="gap-4 mb-8">
            {/* Address Card */}
            <TouchableOpacity
              className="bg-surface-light border-2 border-surface-dark rounded-2xl p-6"
              activeOpacity={0.7}
              onPress={handleMap}
            >
              <View className="flex-row items-start">
                <View className="bg-primary/10 p-3 rounded-full mr-4">
                  <Ionicons name="location" size={24} color="#005a2b" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary text-lg font-black mb-2">Address</Text>
                  <Text className="text-text-secondary text-base leading-6">
                    Unit.5, 1734 Orangebrook Ct,{"\n"}
                    Pickering, ON L1W 3G8
                  </Text>
                  <Text className="text-primary text-sm font-semibold mt-2">Tap to open in Maps</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Phone Card */}
            <TouchableOpacity
              className="bg-surface-light border-2 border-surface-dark rounded-2xl p-6"
              activeOpacity={0.7}
              onPress={handlePhoneCall}
            >
              <View className="flex-row items-start">
                <View className="bg-primary/10 p-3 rounded-full mr-4">
                  <Ionicons name="call" size={24} color="#005a2b" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary text-lg font-black mb-2">Customer Support</Text>
                  <Text className="text-text-secondary text-base">+1 (519) 706-6111</Text>
                  <Text className="text-primary text-sm font-semibold mt-2">Tap to call</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Email Card */}
            <TouchableOpacity
              className="bg-surface-light border-2 border-surface-dark rounded-2xl p-6"
              activeOpacity={0.7}
              onPress={handleEmail}
            >
              <View className="flex-row items-start">
                <View className="bg-primary/10 p-3 rounded-full mr-4">
                  <Ionicons name="mail" size={24} color="#005a2b" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary text-lg font-black mb-2">Email</Text>
                  <Text className="text-text-secondary text-base">infohxnbuildingdepot.ca</Text>
                  <Text className="text-primary text-sm font-semibold mt-2">Tap to send email</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Social Media Section */}
          <View className="mb-8">
            <Text className="text-text-primary text-2xl font-black mb-4">Follow Us</Text>
            <View className="flex-row gap-4">
              <TouchableOpacity
                className="bg-primary rounded-full w-14 h-14 items-center justify-center"
                activeOpacity={0.7}
                onPress={() => Linking.openURL("https://www.facebook.com/share/19QKk73BaA/?mibextid=wwXIfr")}
              >
                <Ionicons name="logo-facebook" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-primary rounded-full w-14 h-14 items-center justify-center"
                activeOpacity={0.7}
                onPress={() => Linking.openURL("https://x.com/filament_freaks?s=21")}
              >
                <Ionicons name="logo-twitter" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-primary rounded-full w-14 h-14 items-center justify-center"
                activeOpacity={0.7}
                onPress={() => Linking.openURL("https://www.instagram.com/freaksfilament?igsh=MTBzb3FtNm5paGd2Ng%3D%3D&utm_source=qr")}
              >
                <Ionicons name="logo-instagram" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-primary rounded-full w-14 h-14 items-center justify-center"
                activeOpacity={0.7}
                onPress={() => Linking.openURL("https://www.youtube.com/@filament_freaks")}
              >
                <Ionicons name="logo-youtube" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Business Hours */}
          <View className="bg-surface-light border-2 border-surface-dark rounded-2xl p-6 mb-8">
            <Text className="text-text-primary text-xl font-black mb-4">Business Hours</Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-text-secondary text-base">Monday - Friday</Text>
                <Text className="text-text-primary font-semibold">9:00 AM - 6:00 PM</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-text-secondary text-base">Saturday</Text>
                <Text className="text-text-primary font-semibold">10:00 AM - 4:00 PM</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-text-secondary text-base">Sunday</Text>
                <Text className="text-text-primary font-semibold">Closed</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

export default ContactScreen;
