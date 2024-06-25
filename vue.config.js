const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');
const { name } = require('./package.json');

const minify =
  process.env.NODE_ENV === 'development'
    ? false
    : {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: true
    };

function resolve(dir) {
  return path.join(__dirname, dir);
}
const _isDEV = process.env.NODE_ENV === 'development';
let _publicPath = _isDEV ? '/' : `/${name}/`;

if (!_isDEV) {
  const [endpoint, , bucket, , project] = process.argv.slice(6);

  if (endpoint) {
    _publicPath = `//${endpoint}/${bucket}/${project}/`;
  }
}
module.exports = {
  publicPath: _publicPath,
  runtimeCompiler: true,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
      minify
    }
  },
  devServer: {
    port: 8000,
    host: '127.0.0.1',
    open: true,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      '/easycode/api': {
        target: 'https://zxjs14.teacherin.vip',
        changeOrigin: true
      },
      '/upload': {
        target: 'https://dynamic13.teacherin.vip',
        changeOrigin: true
      }
    }
  },
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'packages'),
        '@': path.resolve(__dirname, 'src')

      }
    },
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`
    },
    plugins: [],
    resolveLoader: { modules: ['node_modules', 'loaders'] }
  },
  chainWebpack(config) {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();
    config.module
      .rule('fonts')
      .test(/.(ttf|otf|eot|woff|woff2)$/)
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        options = {
          name: '/fonts/[name].[ext]'
        };
        return options;
      })
      .end();
  },
  pluginOptions: {}
};
