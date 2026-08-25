import { WebView } from "react-native-webview";
import { API } from "./_layout";

export default function WebViewScreen() {
  return <WebView source={{ uri: API }} style={{ flex: 1, backgroundColor: "#030712" }} />;
}
