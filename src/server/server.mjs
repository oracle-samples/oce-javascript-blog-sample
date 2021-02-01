/**
 * Copyright (c) 2020, 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import express from 'express';

function commandArgument(key, defaultValue) {
  const keyIndex = process.argv.indexOf(key);

  if (keyIndex < 1 || process.argv.length === keyIndex + 1) {
    if (defaultValue !== undefined) {
      if (defaultValue instanceof Function) {
        return defaultValue();
      }
      console.log(`Using default value ${defaultValue} for key ${key}`);
      return defaultValue;
    }

    throw new Error(`ERROR: missing ${key} <value>`);
  }

  return process.argv[keyIndex + 1];
}

const port = commandArgument('--port', 8881);
const root = commandArgument('--root', '/oce-javascript-blog-sample');

/* serve all of the static data from the src folder */
const app = express();
app.use(root, express.static('src'));

console.log(`Running server on http://localhost:${port}${root}/index.html`);
app.listen(port, '0.0.0.0');
