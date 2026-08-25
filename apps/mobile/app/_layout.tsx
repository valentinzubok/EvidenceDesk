import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const API = process.env.EXPO_PUBLIC_API_URL ?? "https://evidence-desk-chi.valandelon.com";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="index" options={{ title: "Evidence Desk" }} />
        <Stack.Screen name="cases" options={{ title: "Cases" }} />
        <Stack.Screen name="webview" options={{ title: "Full app" }} />
      </Stack>
    </>
  );
}

export { API };
