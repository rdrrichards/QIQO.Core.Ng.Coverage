# QIQO.Core.Ng.Coverage
Getting code coverage working with the ASP.NET Core Angular template

I have been working on this lately, and after some digging I ended up with the below a solution.

**NOTE:** See the references at the bottom of this post to see what I found to get to this solution. Enough of this is (necessarily) different from the source, so I don't think I should get into an trouble concerning copyrights.

First, I added these to the *package.json* for my solution, which was started using the new ASP.NET Core 2.0 Angular template that is available with Visual Studio 2017 (15.3 and up, I think). Add these to the `devDependencies` section of the *package.json*.

    "karma-sourcemap-loader": "^0.3.7",
    "karma-remap-istanbul": "^0.6.0",
    "istanbul-instrumenter-loader": "^3.0.0"

Run `npm install` to add the bits to the application, or save the *package.json* and let VS do it's thing.

Next, I changed the *ClientApp/test/boot-tests.ts* file. 

Change this line:

`const context = require.context('../app/', true, /\.spec\.ts$/);`

to this:

`const context = require.context('../app', true, /\.ts$/);`

This (above) is directly from first reference below.

Next, I replaced the *ClientApp/test/karma.conf.js* content with this:

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

    module.exports = function (config) {
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
            singleRun: true,
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

Now, when I run `npm test` from the root of the application, I get coverage reporting built in the *ClientApp/test/coverage* folder. I also added `text-summary` to the reports options in the *karma.conf.js*, so you get a summary on the command line, too.

You can change the `singleRun` in the *karma.conf.js* to false, if you want this to run and refresh as you make updates to code and unit tests. I ran into an issue where this when I tried all of this with the template after moving to Angular 5.0.0. With ng 5.0.0, a compile time warning is output, which is causing karma to recompile over and over, whether there are changes to code or not. I didn't have this issue with ng 4.x, which is the version the template is using out of the box.

References:

[Angular2SpaCodeCoverage](https://github.com/aspnet/JavaScriptServices/wiki/Angular2SpaCodeCoverage) from the [JavaScriptServices](https://github.com/aspnet/JavaScriptServices) wiki.

This will get you most of the way there, but the section with the changes to the *karma.conf.js* were not quite right, and didn't work with the latest version of the template, or webpack (and I am using 3.8.1 at the time I am writing this). It's usage of the `sourcemap-istanbul-instrumenter-loader` package didn't seem to work anymore either. Which leads me to the next reference.

[Issue: Code coverage for Angular 2 and webpack 2](https://github.com/aspnet/JavaScriptServices/issues/835)

It was the information in the last 2 posts in this issue thread that helped me wrap this one up. Thanks to [Tdortiz](https://github.com/Tdortiz)!. Adding `options: { esModules: true }` to the *karma.conf.js*, and using `istanbul-instrumenter-loader` rather than `sourcemap-istanbul-instrumenter-loader` were the tricks.
