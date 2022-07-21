import { Options as HtmlMinifierOptions } from "html-minifier-terser";
import { JSBeautifyOptions } from 'js-beautify';
import { TemplateOptions } from 'lodash';

export interface Config {
  filename: string;
  title: string | null;
  favicon: string | null;
  template: string;
  content: TemplateOptions | null;
  minify: HtmlMinifierOptions | null;
  format: JSBeautifyOptions | null;
}
