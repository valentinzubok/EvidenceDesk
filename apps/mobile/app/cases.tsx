import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { API } from "./_layout";

export default function CasesScreen() {
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/cases?limit=50`)
      .then((r) => r.json())
      .then((d) => setIds(d.ids ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} color="#2dd4bf" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={ids}
        keyExtractor={(id) => id}
        ListEmptyComponent={<Text style={styles.empty}>No cases</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row}>
            <Text style={styles.id}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#030712" },
  row: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#1f2937" },
  id: { color: "#2dd4bf", fontFamily: "monospace" },
  empty: { color: "#71717a", padding: 20, textAlign: "center" },
});
