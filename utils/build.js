// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";
process.env.ASSET_PATH = "/";

var webpack = require("webpack"),
  config = require("../webpack.config");

//delete config.chromeExtensionBoilerplate;
delete config.custom;

config.mode = "production";

webpack(config, function (err, stats) {
  if (err || stats.hasErrors()) {
    console.error(err || stats.toString());
    return;
  }

  console.log("✅ Build completed successfully.");
});
