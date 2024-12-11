const path = require('path');

module.exports = {
  entry: './src/index.js', // Arquivo principal do jogo
  output: {
    path: path.resolve(__dirname, 'dist'), // Pasta de saída
    filename: 'bundle.js', // Nome do arquivo gerado
  },
  mode: 'development', // Modo de desenvolvimento
  devServer: {
    static: path.join(__dirname, 'public'), // Servir os arquivos da pasta public/
    port: 8081, // Porta do servidor
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Suporte a CSS
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
