const { defineConfig } = require('@vue/cli-service')
const defaultSettings = require('./src/settings.js')
const name = defaultSettings.title || 'vue-mutli-page' // page title
module.exports = defineConfig({
  transpileDependencies: true,
   configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,},
})
