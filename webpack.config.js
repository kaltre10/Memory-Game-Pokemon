const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    module: {
        rules: [
          {
            test: /\.html$/i,
            loader: 'html-loader',
          },
          {
            test: /\.css$/i,
            // use: [MiniCssExtractPlugin.loader, 'css-loader'],
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: "./",
                },
              },
              "css-loader",
            ],
          },
          {
            test: /\.(jpe?g|png)$/i,
            use: ['file-loader?assets/[name].[ext]'],
          },
        ],
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: 'index.html',
          filename: 'index.html'
        }),
        new MiniCssExtractPlugin(),
      ]
}