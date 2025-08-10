import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server:{
    allowedHosts: ['94d34565a07a.ngrok-free.app']
  },
	plugins: [react(), tailwindcss()],
});
