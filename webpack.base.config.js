const path = require('path');
// const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
require("babel-polyfill");

module.exports = {
    entry: {
        main: ["babel-polyfill",'./src/main'],
        //vendors: './src/vendors'
    },
    output: {
        path: path.join(__dirname, './dist')
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader'
            },
            {
                test: /iview\/.*?js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                  process.env.NODE_ENV !== 'production'
                    ? 'vue-style-loader'
                    : MiniCssExtractPlugin.loader,
                  'css-loader'
                ]
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader'
            },
            {
                test: /\.(html|tpl)$/,
                loader: 'html-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue': 'vue/dist/vue.esm.js'
        }
    },
    plugins: [
        // new ServiceWorkerWebpackPlugin({
        //   entry:path.join(__dirname, 'sw.js'),
        // }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new MiniCssExtractPlugin({
            filename: 'style.css'
        }),
        new VueLoaderPlugin(),
    ],
};