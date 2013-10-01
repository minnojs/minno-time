//Install node.js, navigate to the js folder, and then run this command: "node r.js -o app.build.js"
// examples @ https://github.com/jrburke/r.js/blob/master/build/example.build.js
({

  // Creates a js-optimized folder at the same folder level as your "js" folder and places the optimized project there
  dir: "../dist",

  appDir: '../src',
  baseUrl: 'js',

  // Tells Require.js to look at main.js for all shim and path configurations
  mainConfigFile: '../src/js/main.js',

  // Modules to be optimized:
  // we'll keep jquery and underscore seperate so they can be used by all modules
  modules: [
    {
      name: "app/API",
      exclude: ['underscore','jquery']
    },
    {
      name: "extensions/dscore/Scorer",
      exclude: ["app/API",'underscore','jquery']
    }
  ]
})