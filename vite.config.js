import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";


import Markdown from "vite-plugin-react-markdown";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Markdown({
      wrapperComponent: ["src/views/docs/components/*.{jsx,tsx}"],
      wrapperComponentPath: "src/views/blog/BlogWrapper",
    }),
    react({
      include: [/\.tsx$/, /\.md$/], // <-- add .md 
    }),
  
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },


  publicDir: 'assets',
  build: {
    assetsInclude: ['src/assets/**.png', 'src/assets/**.jpg', 'src/assets/**.jpeg', 'src/assets/**.gif', 'src/assets/**.svg'],
  },

});



 