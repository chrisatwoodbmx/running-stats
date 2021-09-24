module.exports = {
  transpileDependencies: ['vuetify'],
  configureWebpack: (config) => {
    config.module.rules = [
      {
        test: /\.worker\.(js|ts)$/i,
        use: [
          {
            loader: 'comlink-loader',
            options: {
              singleton: true,
            },
          },
        ],
      },
      ...config.module.rules,
    ];
  },
};
