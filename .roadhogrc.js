const path = require('path')
const { version } = require('./package.json')

// const svgSpriteDirs = [
//   path.resolve(__dirname, 'src/svg/'),
//   require.resolve('antd').replace(/index\.js$/, '')
// ]

export default {
  entry : 'src/index.js',
  //svgSpriteLoaderDirs : svgSpriteDirs,
  theme : "./theme.config.js",
  publicPath : `/${version}/`,
  outputPath : `./dist/${version}`,
  // 接口代理示例
  "proxy": {
    "/host": {
      "target": "http://192.168.1.88/index.php",
      "changeOrigin": true,
      "pathRewrite": { "^/host" : "" },
    },
  },
  env : {
    development: {
      extraBabelPlugins: [
        "dva-hmr",
        "transform-runtime",
        [
          "import", {
            "libraryName": "antd",
            "style": true
          }
        ]
      ]
    },
    production: {
      extraBabelPlugins: [
        "transform-runtime",
        [
          "import", {
            "libraryName": "antd",
            "style": true
          }
        ]
      ]
    }
  },
  dllPlugin : {
    exclude: ["babel-runtime"],
    include: ["dva/router", "dva/saga", "dva/fetch"]
  }
}
