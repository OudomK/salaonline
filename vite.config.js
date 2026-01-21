// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa'

// export default defineConfig({
//   plugins: [
//     react(),
//     VitePWA({
//       registerType: 'autoUpdate',
//       includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
//       manifest: {
//         name: 'SALA ONLINE',
//         short_name: 'SalaOnline',
//         description: 'School Management System for Cambodia',
//         theme_color: '#ffffff',
//         background_color: '#ffffff',
//         display: 'standalone', // ធ្វើឱ្យវាបើកពេញអេក្រង់ដូច App (បាត់ Address bar)
//         icons: [
//           {
//             src: 'pwa-192x192.png', // អូនត្រូវមានរូបនេះក្នុង folder public
//             sizes: '192x192',
//             type: 'image/png'
//           },
//           {
//             src: 'pwa-512x512.png', // អូនត្រូវមានរូបនេះក្នុង folder public
//             sizes: '512x512',
//             type: 'image/png'
//           }
//         ]
//       }
//     })
//   ],
// })

import path from "path" // 🟢 1. ត្រូវ Import path
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'SALA ONLINE',
        short_name: 'SalaOnline',
        description: 'School Management System for Cambodia',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone', 
        icons: [
          {
            src: 'pwa-192x192.png', 
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png', 
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  // 🟢 2. បន្ថែមផ្នែកនេះសម្រាប់ Shadcn UI
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})