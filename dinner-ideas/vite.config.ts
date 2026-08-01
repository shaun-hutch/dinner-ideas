import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'

// Use VITE_API_TARGET env var for local dev proxy target, or default to
// the production API Gateway URL for the stage being developed against.
const apiTarget = process.env.VITE_API_TARGET || 'https://localhost:3001'

export default defineConfig({
    // depending on your application, base can also be "/"
    base: '',
    plugins: [react(), viteTsconfigPaths()],
    server: {    
        // this ensures that the browser opens upon server start
        open: true,
        // this sets a default port to 3000  
        port: 3000,
        // Proxy /api requests to the API Gateway (or local dev server)
        // In production, CloudFront handles this routing — this is for
        // local development only.
        proxy: {
            '/api': {
                target: apiTarget,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    }
})