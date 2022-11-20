const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';//if current mode is development
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;

module.exports = {
  mode,
  target,
  devtool,
  devServer: {
    port: 3000,
    open: true,
    hot: true,//hot reload, if not reloading then set false
  },
  entry: ['@babel/polyfill', path.resolve(__dirname, 'src', 'index.js')],
  // entry: [path.resolve(__dirname, 'src', 'index.js')],
  output: {
    path: path.resolve(__dirname, 'dist', 'songbird'),
    clean: true,//clear dist folder every time
    // clean: {
    //   keep: /\.git/,//output.clean: true будет затирать внутри папки информацию о том что это worktree (файл .git) и возникнут проблемы.
    // },
    filename: '[name].[contenthash].js',//we can use our own naming (f.e 'main.js')
    assetModuleFilename: 'assets/[hash][ext]',// or 'assets/[name][ext]' to save initial names
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),//path to HTML file
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    })
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(c|sa|sc)ss$/i,//can handle css/sass/scss files
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,//style-loader for dev-mode, minicss for prod
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('postcss-preset-env')],
              }
            }
          },
          'sass-loader'
        ],
      },
      {
        test: /\.woff2?$/i,//formats of fonts
        // test: /\.(woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          // filename: 'fonts/[name][ext]'
          filename: 'assets/fonts/[name][ext]'
        }
      },
      {
        test: /\.mp3$/i,//formats of sounds
        type: 'asset/resource',
        generator: {
          filename: 'assets/sound/[name][ext]'
        }
      },
      {
        test: /\.(jpe?g|png|webp|gif|svg)$/i,//formats of images
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          },
        ],
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]'
        }
      },
      {
        test: /\.m?js$/i,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ],
  },
};