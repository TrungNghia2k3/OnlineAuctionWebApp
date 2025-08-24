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
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@/components/(.*)$': '<rootDir>/src/components/$1',
        '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@/services/(.*)$': '<rootDir>/src/services/$1',
        '^@/models/(.*)$': '<rootDir>/src/models/$1',
        '^@/types/(.*)$': '<rootDir>/src/types/$1',
        '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@/contexts/(.*)$': '<rootDir>/src/contexts/$1',
        '^@/providers/(.*)$': '<rootDir>/src/providers/$1',
        '^@/config/(.*)$': '<rootDir>/src/config/$1',
        '^@/common/(.*)$': '<rootDir>/src/common/$1',
        '^@/api/(.*)$': '<rootDir>/src/api/$1',
        '^@/data/(.*)$': '<rootDir>/src/data/$1',
        '^@/css/(.*)$': '<rootDir>/src/css/$1'
      }
    }
  }
};
