import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 環境変数の読み込み
  const env = loadEnv(mode, process.cwd(), '');
  
  // デフォルトポート設定
  const defaultPort = 3002;
  const port = parseInt(env.FRONTEND_PORT || defaultPort.toString(), 10);
  
  return {
    root: process.cwd(),
    publicDir: 'public',
    build: {
      outDir: 'dist',
      target: 'es2018',
      assetsDir: 'assets',
      cssCodeSplit: true,
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'zustand',
        '@hookform/resolvers/zod',
        'axios'
      ]
    },
    server: {
      port,
      host: true,  // ネットワーク上のすべてのアドレスでリッスン
      strictPort: false, // ポートが使用中の場合、自動的に次のポートを試行
      allowedHosts: 'all', // すべてのホストを許可（本番環境では適切に制限すべき）
      // 開発時にCORSエラーを防ぐためにプロキシを設定
      proxy: {
        '/api': {
          target: `http://localhost:3001`,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
  };
});
