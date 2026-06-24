const NextFederationPlugin = require('@module-federation/nextjs-mf');

module.exports = {
  reactStrictMode: true,
  webpack(config, options) {
    if (!options.isServer) {
      config.plugins.push(
        new NextFederationPlugin({
          name: 'shared_remote',
          filename: 'static/chunks/remoteEntry.js',
          exposes: {
            './store': './src/store/index.ts',
            './Button': './src/components/ui/button.tsx',
            './Input': './src/components/ui/input.tsx',
            './apiHelper': './src/utils/apiHelper.ts',
            './AuthWrapper': './src/components/AuthWrapper.tsx',
          },
          shared: {
            react: { singleton: true, requiredVersion: false },
            'react-dom': { singleton: true, requiredVersion: false },
            '@reduxjs/toolkit': { singleton: true },
            'react-redux': { singleton: true },
            '@tanstack/react-query': { singleton: true },
          },
        })
      );
    }
    return config;
  },
};
