import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'DevQ Tienda',
        short_name: 'DevQ Shop',
        description:'Aplicacion para tienda de abarrotes',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',            
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',  
          },
        ],
      },
    }),
    vue()]
})
