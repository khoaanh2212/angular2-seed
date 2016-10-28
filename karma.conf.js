module.exports = function (config) {
    config.set({

        basePath: '.',

        frameworks: ['mocha','chai', 'browserify'],

        files: [
            {pattern: 'node_modules/systemjs/dist/system-polyfills.js', instrument: false},
            {pattern: 'node_modules/systemjs/dist/system.js', instrument: false},
            {pattern: 'node_modules/rxjs/bundles/Rx.min.js', included: true, watched: true},
            {pattern: 'node_modules/reflect-metadata/**/*.js', included: true, watched: true},
            {pattern: 'node_modules/sinon/lib/sinon.js', included: true, watched: true},
            {pattern: 'node_modules/sinon-chai/lib/sinon-chai.js', included: true, watched: true},
            {pattern: 'app/**/hero.js', included: true, watched: true},
            {pattern: 'app/**/hero.service.js', included: true, watched: true},
            {pattern: 'tests/**/*.js', included: true, watched: true},
        ],


        preprocessors: {
            //'./**/*.ts': [
            //    'typescript'
            //],
            '**/*.js': ['browserify']
        },

        tscPreprocessor: {
            tsConfig: 'tsconfig.json' // relative to __dirname path
        },

        // proxied base paths
        proxies: {
            // required for component assests fetched by Angular's compiler
            '/src/': '/base/src/'
        },

        port: 9876,

        logLevel: config.LOG_INFO,

        colors: true,

        autoWatch: true,

        browsers: ['Chrome'],

        plugins: [
            'karma-mocha',
            'karma-chai',
            'karma-sinon',
            'karma-tsc-preprocessor',
            'karma-typescript-preprocessor',
            'karma-phantomjs-launcher',
            'karma-browserify',
            'karma-jasmine',
            'karma-coverage',
            'karma-chrome-launcher'
        ],

        // Coverage reporter generates the coverage
        reporters: ['progress', 'dots'],

        coverageReporter: {
            reporters: [
                {type: 'json', subdir: '.', file: 'coverage-final.json'}
            ]
        },

        browserify: {
            debug: true
        },

        singleRun: false
    })
};