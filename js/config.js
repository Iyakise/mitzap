/**
 * Mitsab Resources Global — app config
 * ------------------------------------------------------------------
 * APP_URL always resolves to the project ROOT (the folder that holds
 * index.html), regardless of where the project is hosted:
 *   - opened locally straight from disk (file://...)
 *   - served from a local dev server (http://localhost:PORT/)
 *   - served from a subfolder on a shared host (https://domain.com/mitsab/)
 *   - served from the domain root in production (https://mitsabresources.com/)
 *
 * Every page includes this file BEFORE any other script, and BEFORE
 * any <link>/<script> that needs an absolute path. Internal links in
 * the HTML use plain relative paths (about.html, css/style.css, etc.)
 * so the site works even with JS disabled — APP_URL is only needed
 * when a script has to build an absolute URL (e.g. Open Graph tags,
 * sitemap links, fetch() calls to an API on the same host).
 */
(function (global) {
  'use strict';

  function detectEnvironment() {
    var host = global.location.hostname;
    if (host === '' || host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local')) {
      return 'local';
    }
    return 'production';
  }

  function detectRootUrl() {
    var loc = global.location;

    // file:// — opened directly by double-clicking index.html
    if (loc.protocol === 'file:') {
      var path = loc.pathname.replace(/\\/g, '/');
      var dir = path.substring(0, path.lastIndexOf('/') + 1);
      return loc.protocol + '//' + dir;
    }

    // http(s):// — find the project root by locating this script's own
    // <script src="..."> tag and walking back up to the folder above /js/.
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute('src') || '';
      if (src.indexOf('js/config.js') !== -1) {
        var abs = new URL(src, loc.href).href;
        return abs.substring(0, abs.indexOf('js/config.js'));
      }
    }

    // Fallback: same-origin root
    return loc.origin + '/';
  }

  var ENVIRONMENT = detectEnvironment();
  var APP_URL = detectRootUrl().replace(/\/+$/, '') + '/';

  // Manual overrides — set these once you know your real production
  // domain / hosting subfolder, and detection above becomes a fallback.
  var OVERRIDES = {
    local: null,                                   // e.g. 'http://localhost:5500/'
    production: null                                // e.g. 'https://mitsabresources.com/'
  };

  if (OVERRIDES[ENVIRONMENT]) {
    APP_URL = OVERRIDES[ENVIRONMENT];
  }

  global.APP_CONFIG = Object.freeze({
    ENVIRONMENT: ENVIRONMENT,
    APP_URL: APP_URL,
    asset: function (relativePath) {
      return APP_URL + relativePath.replace(/^\/+/, '');
    }
  });

  if (ENVIRONMENT === 'local') {
    console.info('[Mitsab] environment:', ENVIRONMENT, '| APP_URL:', APP_URL);
  }
})(window);
