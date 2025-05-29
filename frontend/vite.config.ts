import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        base: '/',
        plugins: [react(), viteTsconfigPaths()],
        server: mode === 'development'
            ? { open: false, port: parseInt(env.PORT), host: '0.0.0.0' }
            : undefined,
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: ['./setupTest.ts']
        },
    };
});