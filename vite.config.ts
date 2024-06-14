import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load env file based on mode in the current working directory.
  // Set the third parameter to '' to load all env regardless of the VITE_ prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    define: {
      "import.meta.env.VITE_EMQX_DOMAIN": JSON.stringify(env.VITE_API_DOMAIN),
      "import.meta.env.VITE_API_DOMAIN": JSON.stringify(env.VITE_API_DOMAIN),
      "import.meta.env.VITE_EMQX_PROTOCAL": JSON.stringify(env.VITE_API_DOMAIN),
      "import.meta.env.VITE_EMQX_HOST": JSON.stringify(env.VITE_API_DOMAIN),
    },
  };
});
