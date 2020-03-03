
export default {
  chainWebpack(config) {
    config.optimization.splitChunks({
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 10,
      maxInitialRequests: 5,
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
          priority: -11,
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
          test: /[\\/]node_modules[\\/](@antv|bizcharts)[\\/]/,
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
        chunks: ['vendors','antdesigns', 'ethers', 'charts', 'umi']
      }
    ],
    "./umi-plugin-entry.js"
  ],
};
