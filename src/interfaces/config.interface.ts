import type { Options as HtmlMinifierOptions } from 'html-minifier-terser';
import type { JSBeautifyOptions } from 'js-beautify';
import type { TemplateOptions } from 'lodash';

export interface Config {
  filename: string;
  title: string | null;
  favicon: string | null;
  template: string;
  content: TemplateOptions | null;
  minify: HtmlMinifierOptions | null;
  format: JSBeautifyOptions | null;
}
