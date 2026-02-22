import { defineConfig } from 'vite'
export default defineConfig({
    optimizeDeps: {
        exclude: ['@electric-sql/pglite'],
    }, // this is what Franklin covered in class

    //MY ADDITION
    server: {
        host: true,
        watch: {
            usePolling: true,
            interval: 1000
        }
    }
    //END OF MY ADDITION
})

