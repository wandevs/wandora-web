
export default {
  chainWebpack(config) {
    config.optimization.splitChunks({
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 20,
      maxInitialRequests: 20,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          name: 'vendors',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|lodash|lodash-decorators|redux-saga|re-select|dva|moment)[\\/]/,
          priority: -10,
        },
        antdesigns: {
          name: 'antdesigns',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](@ant-design|antd)[\\/]/,
          priority: -10,
        },
        ethers: {
          name: 'ethers',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](ethers-wan)[\\/]/,
          priority: -11,
        },
        charts: {
          name: 'charts',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](bizcharts)[\\/]/,
          priority: -11,
        },
        antv: {
          name: 'antv',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](@antv)[\\/]/,
          priority: -11,
        },
        idna: {
          name: 'idna',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](idna-uts46-hx)[\\/]/,
          priority: -11,
        },
        walletsdk: {
          name: 'walletsdk',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](wan-dex-sdk-wallet)[\\/]/,
          priority: -11,
        },
        mimedb: {
          name: 'mimedb',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](mime-db)[\\/]/,
          priority: -11,
        },
        psl: {
          name: 'psl',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](psl)[\\/]/,
          priority: -11,
        },
      },
     });
  },
  plugins: [
    [
      "umi-plugin-react",
      {
        dva: false,
        antd: true,
        chunks: ['vendors','antdesigns', 'ethers', 'charts', 'antv', 'idna', 'walletsdk', 'mimedb', 'psl', 'umi']
      }
    ],
    "./umi-plugin-entry.js"
  ],
};
