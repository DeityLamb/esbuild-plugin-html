import type { Options as HtmlMinifierOptions } from 'html-minifier-terser';
import type { JSBeautifyOptions } from 'js-beautify';

export const PLUGIN_NAME = 'esbuild-plugin-html';

// default options
export const DEFAULT_FILENAME = 'index.html';

export const DEFAULT_MINIFIER_OPTIONS: HtmlMinifierOptions = {
  collapseWhitespace: true,
  keepClosingSlash: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true
};

export const DEFAULT_FORMAT_OPTIONS: JSBeautifyOptions = {
  indent_size: 2,
  preserve_newlines: false
};

export const DEFAULT_TEMPLATE = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
  </head>
  <body>
  </body>
</html>`;
