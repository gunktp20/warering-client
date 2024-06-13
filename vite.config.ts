import { defineConfig,loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/

export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
   define: {
      VITE_EMQX_DOMAIN: process.env.VITE_EMQX_DOMAIN,
      VITE_API_DOMAIN: process.env.VITE_API_DOMAIN,
      VITE_EMQX_PROTOCAL: process.env.VITE_EMQX_PROTOCAL,
      VITE_EMQX_HOST: process.env.VITE_EMQX_HOST,
    },

  return defineConfig({
    plugins: [react()],
    // To access env vars here use process.env.TEST_VAR
  });
}
