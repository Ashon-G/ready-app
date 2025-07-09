import React, { useEffect } from "react";
import { Platform, View, Button } from "react-native";
import { WebView } from "react-native-webview";

const API_KEY = "55c09aea-7355-4266-8454-edee59ed4c4f";
const INJECTION_ID = "some-id";

export default function VideoAd() {
  // Web implementation: inject the Applixir script and open player on button press
  if (Platform.OS === "web") {
    useEffect(() => {
      if (!document.getElementById("applixir-script")) {
        const script = document.createElement("script");
        script.id = "applixir-script";
        script.src = "https://cdn.applixir.com/applixir.app.v6.0.1.js";
        script.async = true;
        document.body.appendChild(script);
      }
    }, []);

    const handlePress = () => {
      const options = {
        apiKey: API_KEY,
        injectionElementId: INJECTION_ID,
        adStatusCallbackFn: (status: any) => console.log("OUTSIDE Ad status: ", status),
        adErrorCallbackFn: (error: any) => console.log("Error: ", error.getError().data),
      };
      // @ts-ignore
      if (typeof initializeAndOpenPlayer === "function") {
        // @ts-ignore
        initializeAndOpenPlayer(options);
      }
    };

    return (
      <View>
        <div id={INJECTION_ID}></div>
        <Button title="Play Ad" onPress={handlePress} />
      </View>
    );
  }

  // Native implementation: use a WebView with embedded HTML
  const html = `
    <div id="${INJECTION_ID}"></div>
    <button id="start">Play Ad</button>
    <script type="text/javascript" src="https://cdn.applixir.com/applixir.app.v6.0.1.js"></script>
    <script type="text/javascript">
      const options = {
        apiKey: "${API_KEY}",
        injectionElementId: "${INJECTION_ID}",
        adStatusCallbackFn: (status) => {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'status', status }));
        },
        adErrorCallbackFn: (error) => {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', error: error.getError().data }));
        },
      };
      document.getElementById('start').addEventListener('click', () => {
        initializeAndOpenPlayer(options);
      });
    </script>`;

  return <WebView originWhitelist={["*"]} source={{ html }} />;
}
