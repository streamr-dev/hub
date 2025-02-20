process.env.NODE_ENV = process.env.NODE_ENV || 'development' // set a default NODE_ENV
const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackNotifierPlugin = require('webpack-notifier')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const ESLintPlugin = require('eslint-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const DeadCodePlugin = require('webpack-deadcode-plugin')
const cssProcessor = require('clean-css')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { GitRevisionPlugin } = require('git-revision-webpack-plugin')
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const createStyledComponentsTransformer =
    require('typescript-plugin-styled-components').default
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const validateEnv = require('./scripts/validateEnv')
const pkg = require('./package')
const pkgLock = require('./package-lock')

const dotenv = require('./scripts/dotenv')

const loadedDotenv = !process.env.NO_DOTENV ? dotenv() : []
const analyze = !!process.env.BUNDLE_ANALYSIS
const styledComponentsTransformer = createStyledComponentsTransformer()

const isProduction = require('./scripts/isProduction')

const root = path.resolve(__dirname)
const dist = path.resolve(root, 'dist')
const gitRevisionPlugin = new GitRevisionPlugin()

if (isProduction() && !process.env.STORYBOOK) {
    validateEnv(process.env)
}

const commitHash = gitRevisionPlugin.commithash()?.substring(0, 10) || 'N/A'

// We have to make sure that publicPath ends with a slash. If it
// doesn't then chunks are not gonna load correctly. #codesplitting
const publicPath = `${process.env.PLATFORM_PUBLIC_PATH || ''}/`
module.exports = {
    mode: isProduction() ? 'production' : 'development',
    entry: [
        // forcibly print diagnostics upfront
        path.resolve(root, 'src', 'shared', 'utils', 'diagnostics.ts'),
        // always load setup first
        './setup.ts',
        './index.tsx',
    ],
    output: {
        path: dist,
        filename: 'bundle_[name]_[hash:8].js',
        chunkFilename: '[name].bundle_[contenthash:8].js',
        sourceMapFilename: '[name]_[hash:8].map',
        publicPath,
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            getCustomTransformers: () => ({
                                before: [styledComponentsTransformer],
                            }),
                        },
                    },
                ],
            },
            {
                test: /\.m?js$/,
                resolve: {
                    fullySpecified: false,
                },
            },
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                include: [path.resolve(root, 'src'), path.resolve(root, 'scripts')],
                options: {
                    rootMode: 'upward',
                    cacheDirectory: !isProduction(),
                    compact: isProduction(),
                },
            },
            {
                test: /\.md$/,
                loader: 'raw-loader',
            },
            // Images are put to <BASE_URL>/images
            {
                test: /\.(png|jpg|jpeg|svg)$/,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                type: 'asset/resource',
            },
            {
                test: /\.css$/,
                use: [
                    !isProduction() ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentRegExp: /src\/([^/]+)/i,
                                localIdentName: isProduction()
                                    ? '[local]_[hash:base64:8]'
                                    : '[1]_[name]_[local]',
                            },
                            importLoaders: 1,
                        },
                    },
                ],
            },
            {
                test: /\.toml$/,
                loader: 'toml-loader',
            },
        ],
    },
    plugins: [
        // Common plugins between prod and dev
        new NodePolyfillPlugin({
            additionalAliases: ['process'],
        }),
        new ESLintPlugin({
            extensions: ['tsx', 'ts'],
        }),
        new ForkTsCheckerWebpackPlugin({
            issue: {
                include: [{ file: '**/src/**/*' }],
            },
        }),
        new HtmlWebpackPlugin({
            template: 'index.html',
            templateParameters: {
                gtmId: process.env.GTM_ID,
                commitHash,
                version: pkg.version,
            },
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: !isProduction() ? '[name].css' : '[name].[contenthash:8].css',
            chunkFilename: !isProduction() ? '[id].css' : '[id].[contenthash:8].css',
        }),
        new webpack.EnvironmentPlugin({
            GIT_VERSION: gitRevisionPlugin.version(),
            GIT_BRANCH: gitRevisionPlugin.branch(),
            SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT || '',
            SENTRY_DSN: process.env.SENTRY_DSN || '',
            VERSION: process.env.VERSION || '',
            STREAMR_DOCKER_DEV_HOST: process.env.STREAMR_DOCKER_DEV_HOST || '',
            NETWORK_GRAPH_SCHEMA_PATH: process.env.NETWORK_GRAPH_SCHEMA_PATH || '',
            DU_GRAPH_SCHEMA_PATH: process.env.DU_GRAPH_SCHEMA_PATH || '',
            ENS_GRAPH_SCHEMA_PATH: process.env.ENS_GRAPH_SCHEMA_PATH || '',
            HUB_CONFIG_ENV: process.env.HUB_CONFIG_ENV || '',
            STREAM_GPT_API_URL:
                process.env.STREAM_GPT_API_URL || 'https://streamgpt.streamr.network/',
            HUB_VERSION: pkg.version,
            STREAMR_SDK_VERSION: pkgLock.packages['node_modules/@streamr/sdk'].version,
            STREAMR_CONFIG_VERSION:
                pkgLock.packages['node_modules/@streamr/config'].version,
            COMMIT_HASH: commitHash,
        }),
        new webpack.EnvironmentPlugin(loadedDotenv),
        ...(analyze
            ? [
                new BundleAnalyzerPlugin({
                    analyzerMode: 'static',
                    openAnalyzer: false,
                }),
            ]
            : []),
        // Ignore all locale files of moment.js
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
        }),
        // Fix process is not defined error
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        // Work around for Buffer is undefined:
        // https://github.com/webpack/changelog-v5/issues/10
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ]
        .concat(
            isProduction()
                ? [
                    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [dist] }),
                    // Production plugins
                    // new webpack.optimize.OccurrenceOrderPlugin(), // commented out as it started throwing errors after update to webpack5
                    new webpack.EnvironmentPlugin({
                        NODE_ENV: 'production',
                    }),
                    new OptimizeCssAssetsPlugin({
                        cssProcessor,
                        cssProcessorOptions: {
                            discardComments: {
                                removeAll: true,
                            },
                        },
                        canPrint: true,
                    }),
                    new ImageminPlugin({
                        disable: !isProduction(), // Disable during development
                        pngquant: {
                            quality: '50-75',
                        },
                    }),
                ]
                : [
                    // Dev plugins
                    new DeadCodePlugin({
                        exclude: [
                            '**/node_modules/**/*.*',
                            'storybook-static/**/*.*',
                            'dist/**/*.*',
                            'coverage/**/*.*',
                            // skip tests
                            '**/tests/*.*',
                            '**/tests/**/*.*',
                            '**/test/*.*',
                            '**/test/**/*.*',
                            '**/*.test.ts',
                            '**/*.test.tsx',
                            // skip conditional stubs
                            '**/stub.tsx',
                            // skip stories
                            '**/*.stories.*',
                            // skip sketch files
                            '**/*.sketch',
                            // other files
                            'package-lock.json',
                            'codegen.ts',
                            'README.md',
                            'babel.config.js',
                            'codegen.ts',
                            'cypress.config.ts',
                            'healthcheck.ts',
                            'jest.config.js',
                            'webpack.config.*',
                            'nginx.conf',
                            'src/generated/**/*.*',
                            '*.json',
                            'scripts/**/*.*',
                            'cypress/**/*.*',
                            'src/queries/*.ts',
                            '**/*.css',
                            'types/**/*.d.ts',
                        ],
                    }),
                    new WebpackNotifierPlugin(),
                ],
        )
        .concat(
            process.env.SENTRY_AUTH_TOKEN
                ? [
                    sentryWebpackPlugin({
                        include: dist,
                        validate: true,
                        org: process.env.SENTRY_ORG || 'streamr',
                        project: process.env.SENTRY_PROJECT || 'hub',
                        authToken: process.env.SENTRY_AUTH_TOKEN,
                        ignore: [
                            '.cache',
                            '.DS_STORE',
                            '.env',
                            '.envrc',
                            '.storybook',
                            'bin',
                            'coverage',
                            'node_modules',
                            'scripts',
                            'stories',
                            'test',
                            'webpack.config.js',
                        ],
                        release: process.env.VERSION,
                    }),
                ]
                : [],
        ),
    devtool: isProduction() ? 'source-map' : 'eval-source-map',
    devServer: {
        client: {
            overlay: {
                warnings: false,
                errors: true,
            },
        },
        historyApiFallback: {
            index: publicPath,
            disableDotRule: true,
        },
        hot: true,
        // inline: true,
        // progress: true,
        port: process.env.PORT || 3333,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': '*',
        },
    },
    // automatically creates a vendor chunk & also
    // seems to prevent out of memory errors during dev ??
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        usedExports: true,
        minimize: isProduction(),
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: true,
                },
            }),
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        symlinks: false,
        alias: {
            // Make sure you set up aliases in flow and jest configs.
            $testUtils: path.resolve(__dirname, 'test/test-utils/'),
            '~': path.resolve(__dirname, 'src/'),
            // When duplicate bundles point to different places.
            '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime'),
            'bn.js': path.resolve(__dirname, 'node_modules/bn.js'),
            'eth-lib': path.resolve(__dirname, 'node_modules/eth-lib'),
            eventemitter3: path.resolve(__dirname, 'node_modules/eventemitter3'),
            invariant: path.resolve(__dirname, 'node_modules/invariant'),
            isarray: path.resolve(__dirname, 'node_modules/isarray'),
            'query-string': path.resolve(__dirname, 'node_modules/query-string'),
            'regenerator-runtime': path.resolve(
                __dirname,
                'node_modules/regenerator-runtime',
            ),
            'strict-uri-encode': path.resolve(
                __dirname,
                'node_modules/strict-uri-encode',
            ),
            warning: path.resolve(__dirname, 'node_modules/warning'),
            underscore: path.resolve(__dirname, 'node_modules/underscore'),
            react: path.resolve(__dirname, 'node_modules/react'),
            'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
            'styled-components': path.resolve(
                __dirname,
                'node_modules/styled-components',
            ),
            'prosemirror-model': path.resolve(
                __dirname,
                'node_modules/prosemirror-model',
            ),
        },
    },
}
