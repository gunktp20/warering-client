import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/

export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react()],
    define: {
      "import.meta.env.VITE_EMQX_DOMAIN": JSON.stringify(
        process.env.VITE_EMQX_DOMAIN
      ),

      "import.meta.env.VITE_API_DOMAIN": JSON.stringify(
        process.env.VITE_API_DOMAIN
      ),
      "import.meta.env.VITE_EMQX_PROTOCAL": JSON.stringify(
        process.env.VITE_API_DOMAIN
      ),
      "import.meta.env.VITE_EMQX_HOST": JSON.stringify(
        process.env.VITE_API_DOMAIN
      ),
    },
  });
};
