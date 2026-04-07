import { defineConfig } from 'vite'
export default defineConfig({
    optimizeDeps: {
        exclude: ['@electric-sql/pglite'],
    }, 

    //MY ADDITION
    server: {
        host: true,
        watch: {
            usePolling: true,
            interval: 1000,
        }
    }
    //END OF MY ADDITION
})

