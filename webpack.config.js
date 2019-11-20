const Dotenv = require("dotenv-webpack")
const path = require("path")

let config = {
    devServer: {
        contentBase: path.resolve(__dirname, "public")
    },
    entry: "./src/main.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "public")
    },
    plugins: []
}

module.exports = (env, argv) => {
    let dotenv_path = path.resolve(__dirname, ".env")
    if (argv.mode === "production")
        dotenv_path = path.resolve(__dirname, ".env.deploy")

    // Add Dotenv plugin, with the specified path
    config.plugins.push(new Dotenv({
        path: dotenv_path
    }))

    return config
}
