const path = require("path")
const Dotenv = require("dotenv-webpack")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = (env, argv) => {
    let config = {
        devServer: {
            contentBase: path.resolve(__dirname, "public")
        },
        entry: "./src/main.js",
        module: {
            rules: [
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                config: {
                                    ctx: {
                                        mode: argv.mode
                                    }
                                }
                            }
                        }
                    ]
                }
            ]
        },
        output: {
            filename: "main.js",
            path: path.resolve(__dirname, "public")
        },
        plugins: [
            new MiniCssExtractPlugin()
        ]
    }

    let dotenv_path = path.resolve(__dirname, ".env")
    if (argv.mode === "production")
        dotenv_path = path.resolve(__dirname, ".env.deploy")

    // Add Dotenv plugin, with the specified path
    config.plugins.push(new Dotenv({
        path: dotenv_path
    }))

    return config
}
