import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    // depending on your application, base can also be "/"
    base: '/',
    plugins: [react(), viteTsconfigPaths()],
    server: {    
        // this ensures that the browser opens upon server start
        open: false,
        // this sets a default port to 3000  
        port: 3000, 
        host: '0.0.0.0' // listen on all network interfaces
    },
    test: {
        globals: true,
        environment: 'jsdom',
        // Optionally specify include/exclude patterns
        // include: ['src/**/*.test.{js,ts,jsx,tsx}'],
    },
})