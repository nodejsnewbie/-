import { defineConfig } from '@tarojs/cli';
import { UnifiedWebpackPluginV5 } from 'weapp-tailwindcss/webpack';

export default defineConfig({
  projectName: 'hnhall-technician',
  date: '2026-10-04',
  designWidth: 750,
  deviceRatio: {
    640: 2.34,
    750: 1,
    828: 1.81,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: ['@tarojs/plugin-framework-react', '@tarojs/plugin-platform-weapp'],
  framework: 'react',
  compiler: {
    type: 'webpack5',
    prebundle: {
      enable: false,
    },
  },
  mini: {
    webpackChain(chain) {
      chain.plugin('weapp-tailwindcss').use(UnifiedWebpackPluginV5, [{ appType: 'taro' }]);
    },
  },
  h5: {},
});
