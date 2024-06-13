import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    VITE_EMQX_DOMAIN: process.env.VITE_EMQX_DOMAIN,
    VITE_API_DOMAIN: process.env.VITE_API_DOMAIN,
    VITE_EMQX_PROTOCAL: process.env.VITE_EMQX_PROTOCAL,
    VITE_EMQX_HOST: process.env.VITE_EMQX_HOST,
  },
});
