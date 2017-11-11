// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

const path = require('path');

var webpackConfig = require('../../webpack.config.js')().filter(config => config.target !== 'node')[0];
webpackConfig.module.rules.push({
    test: /\.ts$/,
    include: [path.resolve(__dirname, '../app')],
    use: {
        loader: 'istanbul-instrumenter-loader?force-sourcemap=true',
        options: { esModules: true }
    },
    enforce: 'post',
    exclude: [/\.spec\.ts$/]
});

module.exports = function(config) {
  config.set({
    basePath: '.',
    frameworks: ['jasmine'],
    files: ['../../wwwroot/dist/vendor.js', './boot-tests.ts'],
    preprocessors: {
      './boot-tests.ts': ['webpack']
    },
    reporters: ['progress', 'karma-remap-istanbul'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    mime: { 'application/javascript': ['ts', 'tsx'] },
    singleRun: false,
    webpack: webpackConfig,
    webpackMiddleware: { stats: 'errors-only' },
    remapIstanbulReporter: {
      reports: {
        html: 'ClientApp/test/coverage',
        'text-summary': null
      }
    }
  });
};
