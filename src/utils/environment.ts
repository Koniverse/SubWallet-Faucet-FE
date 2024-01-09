// Load all environment variables from .env file

import MobileDetect from "mobile-detect";
const detect = new MobileDetect(navigator.userAgent, 1200);
export const isAndroid = detect.os() === 'AndroidOS'
export const isIOS = detect.os() === 'iOS'
export const isMobile = isIOS || isAndroid;
