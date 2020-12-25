const path = require("path")
const Dotenv = require("dotenv-webpack")

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
                    use: ["style-loader", "css-loader", "postcss-loader"]
                }
            ]
        },
        output: {
            filename: "main.js",
            path: path.resolve(__dirname, "public")
        },
        plugins: []
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
