import react from '@vitejs/plugin-react'; // Hapus jika tidak pakai React

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Opsional: Naikkan batas peringatan
  },
});
