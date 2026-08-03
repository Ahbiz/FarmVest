import { resolve } from 'path';
import { defineConfig } from 'vite';
import fs from 'fs';

function getHtmlInputs(dir, baseDir = '') {
  let entries = {};
  if (!fs.existsSync(dir)) return entries;
  
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const res = resolve(dir, file.name);
    if (file.isDirectory() && file.name !== 'node_modules' && file.name !== 'dist' && file.name !== 'public') {
      Object.assign(entries, getHtmlInputs(res, `${baseDir}${file.name}/`));
    } else if (file.isFile() && file.name.endsWith('.html')) {
      const name = `${baseDir}${file.name.replace('.html', '')}`.replace(/\//g, '_');
      entries[name] = res;
    }
  }
  return entries;
}

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: getHtmlInputs(__dirname),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});
