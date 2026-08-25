import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { API } from "./_layout";

type Summary = { total: number; clean: number; tampered: number };

export default function HomeScreen() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    fetch(`${API}/api/cases/summary`)
      .then((r) => r.json())
      .then(setSummary)
      .catch(() => setSummary(null));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Evidence Desk Mobile</Text>
      <Text style={styles.sub}>Read-only console for GenLayer evidence</Text>
      {summary ? (
        <View style={styles.stats}>
          <Text style={styles.stat}>Cases: {summary.total}</Text>
          <Text style={styles.stat}>Clean: {summary.clean}</Text>
          <Text style={styles.stat}>Tampered: {summary.tampered}</Text>
        </View>
      ) : (
        <ActivityIndicator color="#2dd4bf" />
      )}
      <Link href="/cases" asChild>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Browse cases</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/webview" asChild>
        <TouchableOpacity style={[styles.btn, styles.btnGhost]}>
          <Text style={styles.btnText}>Open full web app</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#030712", padding: 20, gap: 12 },
  title: { color: "#f4f4f5", fontSize: 22, fontWeight: "700" },
  sub: { color: "#a1a1aa", fontSize: 14 },
  stats: { flexDirection: "row", gap: 12, marginVertical: 8 },
  stat: { color: "#99f6e4", fontSize: 13 },
  btn: { backgroundColor: "#0d9488", padding: 14, borderRadius: 10, alignItems: "center" },
  btnGhost: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#334155" },
  btnText: { color: "#fff", fontWeight: "600" },
});
