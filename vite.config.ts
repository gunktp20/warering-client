import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, mode }) => {
  // Load env file based on mode in the current working directory.
  // Set the third parameter to '' to load all env regardless of the VITE_ prefix.
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    define: {
      "import.meta.env.VITE_EMQX_DOMAIN": env.VITE_EMQX_DOMAIN
        ? JSON.stringify(env.VITE_EMQX_DOMAIN)
        : "http://13.229.135.29:8083/mqtt",

      "import.meta.env.VITE_API_DOMAIN": env.VITE_API_DOMAIN
        ? JSON.stringify(env.VITE_API_DOMAIN)
        : "http://www.warering.online/api/",
      "import.meta.env.VITE_EMQX_PROTOCAL": env.VITE_API_DOMAIN
        ? JSON.stringify(env.VITE_API_DOMAIN)
        : "ws",
      "import.meta.env.VITE_EMQX_HOST": env.VITE_API_DOMAIN
        ? JSON.stringify(env.VITE_API_DOMAIN)
        : "13.229.135.29",
    },
  };
});
