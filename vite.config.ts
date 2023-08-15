import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import gzipPlugin from 'rollup-plugin-gzip';
import terser from '@rollup/plugin-terser';

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsConfigFilePath: 'tsconfig.json',
      rollupTypes: true,
      outputDir: 'types',
      insertTypesEntry: true,
      noEmitOnError: true,
      skipDiagnostics: false,
      logDiagnostics: true,
    }),
    terser(),
    gzipPlugin(),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ReactDragula',
      formats: ['es', 'umd'],
      fileName: (format) => `react-dragula.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    sourcemap: false,
  },
});
