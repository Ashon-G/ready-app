import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import { WebView } from "react-native-webview";

const API_KEY = "55c09aea-7355-4266-8454-edee59ed4c4f";
const INJECTION_ID = "some-id";

type Props = {
  visible: boolean;
  onClose?: () => void;
};

export default function VideoAd({ visible, onClose }: Props) {
  // Load the Applixir script on web once
  useEffect(() => {
    if (Platform.OS === "web" && !document.getElementById("applixir-script")) {
      const script = document.createElement("script");
      script.id = "applixir-script";
      script.src = "https://cdn.applixir.com/applixir.app.v6.0.1.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Open the player when visible becomes true
  useEffect(() => {
    if (Platform.OS === "web" && visible) {
      const options = {
        apiKey: API_KEY,
        injectionElementId: INJECTION_ID,
        adStatusCallbackFn: (status: any) => {
          if (
            ["thankYouModalClosed", "manuallyEnded", "allAdsCompleted"].includes(
              status.type
            )
          ) {
            onClose?.();
          }
        },
        adErrorCallbackFn: () => onClose?.(),
      };
      // @ts-ignore - loaded from external script
      if (typeof initializeAndOpenPlayer === "function") {
        // @ts-ignore
        initializeAndOpenPlayer(options);
      }
    }
  }, [visible, onClose]);

  if (!visible) {
    return null;
  }

  if (Platform.OS === "web") {
    return <div id={INJECTION_ID}></div>;
  }

  // Native implementation: open player automatically
  const html = `
    <div id="${INJECTION_ID}"></div>
    <script type="text/javascript" src="https://cdn.applixir.com/applixir.app.v6.0.1.js"></script>
    <script type="text/javascript">
      const options = {
        apiKey: "${API_KEY}",
        injectionElementId: "${INJECTION_ID}",
        adStatusCallbackFn: (status) => {
          if (["thankYouModalClosed", "manuallyEnded", "allAdsCompleted"].includes(status.type)) {
            window.ReactNativeWebView.postMessage('close');
          }
        },
        adErrorCallbackFn: () => { window.ReactNativeWebView.postMessage('close'); },
      };
      window.onload = function () { initializeAndOpenPlayer(options); };
    </script>`;

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ html }}
      onMessage={() => onClose?.()}
    />
  );
}
