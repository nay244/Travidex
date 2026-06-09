module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', { root: ['./'], alias: { '@': './' } }],
      // NOTE: 'react-native-reanimated/plugin' will be added (kept LAST) in a later phase — do NOT add it now
    ],
  };
};
