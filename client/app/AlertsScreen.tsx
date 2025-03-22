import React from "react";
import { View, Text } from "react-native";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";
import globalStyles from "@/styles/globalStyles";

export default function AlertsScreen() {
  return (
    <ScreenWithBackButton title="Alert" style={globalStyles.screenContainer}>
      <View style={globalStyles.screenContainer}>
        <Text style={globalStyles.title}>Alerts</Text>
        <Text style={globalStyles.cardText}>
          This is the Alerts screen. Content will be added soon.
        </Text>
      </View>
    </ScreenWithBackButton>
  );
}
