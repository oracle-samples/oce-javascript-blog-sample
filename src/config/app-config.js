/**
 * Copyright (c) 2020, 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/* global requirejs */
requirejs.config({
  baseUrl: 'lib',
  paths: {
    jquery: 'jquery',
    contentsdk: 'contentsdk',
    polyfill: 'polyfill',
    serverUtils: 'server-config-utils',
    services: 'services',
    xss: 'xss',
  },
  shim: {
    xss: {
      exports: 'filterXSS',
    },
  },
});
