module.exports = {
    preset: 'jest-expo',
    transformIgnorePatterns: [
      "node_modules/(?!(jest-)?react-native" +
        "|@react-native" +
        "|@react-navigation" +
        "|@expo" +
        "|expo" +
        "|expo-modules-core" +
        "|react-native-svg" +
        ")"
    ],
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  };
  