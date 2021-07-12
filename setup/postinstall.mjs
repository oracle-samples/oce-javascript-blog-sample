/**
 * Copyright (c) 2020, 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */
import { existsSync, mkdirSync, copyFileSync } from 'fs';

const libDir = 'src/lib';

// eslint-disable-next-line no-console
console.log(`Copying libararies to ${libDir}...`);
if (!existsSync(libDir)) {
  mkdirSync(libDir);
}

copyFileSync('node_modules/requirejs/require.js', `${libDir}/require.js`);
copyFileSync('node_modules/jquery/dist/jquery.js', `${libDir}/jquery.js`);
copyFileSync('node_modules/@oracle/content-management-sdk/dist/content.umd.js', `${libDir}/contentsdk.js`);
copyFileSync('node_modules/babel-polyfill/dist/polyfill.js', `${libDir}/polyfill.js`);
copyFileSync('node_modules/xss/dist/xss.js', `${libDir}/xss.js`);