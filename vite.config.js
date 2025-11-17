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
        // explicitly include your GIFs/images in public
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
        // Precache ALL built assets: js, css, html, images, gifs, json, etc.
        globDirectory: "dist",
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,json}",
        ],
        navigateFallback: "index.html",
        runtimeCaching: [
          {
            // extra safety for runtime requests
            urlPattern: ({ request }) =>
              request.destination === "script" ||
              request.destination === "style" ||
              request.destination === "image" ||
              request.destination === "font",
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
