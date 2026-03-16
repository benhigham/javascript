/** @import { Config } from 'browserslist' */

const desktopConfig = [
  "last 2 Chrome major versions",
  "last 2 Firefox major versions",
  "last 2 Safari major versions",
  "last 2 Edge major versions",
];

const mobileConfig = [
  "last 2 Android major versions",
  "last 2 ChromeAndroid major versions",
  "last 2 FirefoxAndroid major versions",
  "last 2 iOS major versions",
];

/**
 * A shared Browserslist configuration.
 * @type {Config | string[]}
 */
const config = [
  "defaults and fully supports es6-module",
  ...desktopConfig,
  ...mobileConfig,
];

export default config;
