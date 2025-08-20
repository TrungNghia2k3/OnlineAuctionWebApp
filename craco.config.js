const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/services': path.resolve(__dirname, 'src/services'),
      '@/models': path.resolve(__dirname, 'src/models'),
      '@/types': path.resolve(__dirname, 'src/types'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
      '@/contexts': path.resolve(__dirname, 'src/contexts'),
      '@/providers': path.resolve(__dirname, 'src/providers'),
      '@/config': path.resolve(__dirname, 'src/config'),
      '@/common': path.resolve(__dirname, 'src/common'),
      '@/api': path.resolve(__dirname, 'src/api'),
      '@/data': path.resolve(__dirname, 'src/data'),
      '@/css': path.resolve(__dirname, 'src/css'),
    }
  }
};
