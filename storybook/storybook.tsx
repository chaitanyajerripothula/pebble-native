import * as React from "react";
import { AppRegistry } from "react-native";
import {
  getStorybookUI,
  configure,
  addDecorator
} from "@storybook/react-native";
import { withKnobs } from "@storybook/addon-knobs";

addDecorator(withKnobs);

// import stories
configure(() => {
  require("./stories");
}, module);

// This assumes that storybook is running on the same host as your RN packager,
// to set manually use, e.g. host: 'localhost' option
const StorybookUIRoot = getStorybookUI({ port: 7007, onDeviceUI: true });

import "./rn-addons";

// react-native hot module loader must take in a Class - https://github.com/facebook/react-native/issues/10991
// https://github.com/storybooks/storybook/issues/2081
// eslint-disable-next-line react/prefer-stateless-function
class StorybookUIHMRRoot extends React.Component {
  render() {
    return <StorybookUIRoot />;
  }
}

AppRegistry.registerComponent("pebbleNative", () => StorybookUIHMRRoot);
export default StorybookUIHMRRoot;
