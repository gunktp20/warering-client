import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/

export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), "") }; 
  if (mode === "production") {
    return defineConfig({
      plugins: [react()],
      define: {
        "import.meta.env.VITE_EMQX_DOMAIN": JSON.stringify(
          process.env.VITE_EMQX_DOMAIN || "ws://13.250.116.125:8083/mqtt"
        ),

        "import.meta.env.VITE_API_DOMAIN": JSON.stringify(
          process.env.VITE_API_DOMAIN || "http://warering.online/api/"
        ),
        "import.meta.env.VITE_EMQX_PROTOCAL": JSON.stringify(
          process.env.VITE_API_DOMAIN || "ws"
        ),
        "import.meta.env.VITE_EMQX_HOST": JSON.stringify(
          process.env.VITE_API_DOMAIN || "13.250.116.125"
        ),
        "import.meta.env.VITE_MQTT_DOMAIN": JSON.stringify(
          process.env.VITE_MQTT_DOMAIN || "http://13.250.116.125"
        ),
      },
    });
  }
  return defineConfig({
    plugins: [react()],
    // To access env vars here use process.env.TEST_VAR
  });
}
