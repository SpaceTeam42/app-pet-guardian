module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          // NOME QUE VAI UTILIZAR PARA IMPORTAR AS VARIÁVEIS DE AMBIENTE
          moduleName: '@env',
          // SE VAI PERMITIR OU NÃO VARIÁVEIS DE AMBIENTE UNDEFINED
          allowUndefined: false
        }
      ],
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@assets': './src/assets',
            '@components': './src/components',
            '@config': './src/config',
            "@dtos": "./src/dtos",
            '@hooks': './src/hooks',
            '@routes': './src/routes',
            '@screens': './src/screens',
            "@storage": "./src/storage",
            '@libs': './src/libs',
            '@theme': './src/theme',
            '@utils': './src/utils'
          }
        }
      ],
      [
        'inline-import',
        {
          extensions: ['.md', '.mdx'],
        },
      ],
      'react-native-reanimated/plugin',
    ]
  };
};
