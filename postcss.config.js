const purgecss = require("@fullhuman/postcss-purgecss")({
    content: ["./public/index.html"],
    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
})

module.exports = ({ file, options, env }) => ({
    plugins: [
        require("tailwindcss"),
        ...options.mode === "production" ? [purgecss, require("cssnano")] : []
    ]
})
