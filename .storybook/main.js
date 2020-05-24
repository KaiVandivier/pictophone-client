module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader"],
      },
      {
        test: /\.css$/,
        use: {
          loader: "css-loader",
          options: {
            modules: true,
          },
        },
      },
    ],
  },
  stories: ["../src/**/*.stories.js"],
  addons: [
    "@storybook/preset-create-react-app",
    "@storybook/addon-actions",
    "@storybook/addon-knobs",
    "@storybook/addon-links",
  ],
};
