const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add cjs to sourceExts to support libraries that ship with it
config.resolver.sourceExts.push('cjs');

module.exports = config;
