import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "pwa-192x192.png",
        "pwa-512x512.png",

        // Add your GIFs and images here
        "thinking.gif",
        "yes.gif",
        "no.gif",
        "Walking_girl2.gif",
        "flying_bird.gif",
        "standing_character.gif",
        "clap.gif",
      ],

      manifest: {
        name: "Aniston Quiz App",
        short_name: "AnistonQuiz",
        description: "Aniston AV interactive quiz with coupon rewards.",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

      workbox: {
        // 💥 SET MAX FILE SIZE TO 50 MB
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // 50 MB

        globDirectory: "dist",
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,json,webp}"
        ],

        navigateFallback: "index.html",

        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === "script" ||
              request.destination === "style" ||
              request.destination === "image" ||
              request.destination === "font" ||
              request.destination === "document",
            handler: "CacheFirst",
            options: {
              cacheName: "aniston-static-cache",
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
});
