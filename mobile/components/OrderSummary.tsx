import { View, Text } from "react-native";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export default function OrderSummary({ subtotal, shipping, tax, total }: OrderSummaryProps) {
  return (
    <View className="px-6 mt-6">
      <View className="bg-surface-light border border-surface-dark rounded-3xl p-5 shadow-sm">
        <Text className="text-text-primary text-xl font-bold mb-4">Order Summary</Text>

        <View className="space-y-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-text-secondary text-base">Subtotal</Text>
            <Text className="text-text-primary font-semibold text-base">
              ₹{subtotal.toLocaleString()}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-text-secondary text-base">Shipping</Text>
            <Text className="text-text-primary font-semibold text-base">
              ₹{shipping.toLocaleString()}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-text-secondary text-base">GST (18%)</Text>
            <Text className="text-text-primary font-semibold text-base">₹{tax.toLocaleString()}</Text>
          </View>

          {/* Divider */}
          <View className="border-t border-surface-dark pt-3 mt-1" />

          {/* Total */}
          <View className="flex-row justify-between items-center">
            <Text className="text-text-primary font-bold text-lg">Total</Text>
            <Text className="text-primary font-bold text-2xl">₹{total.toLocaleString()}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
