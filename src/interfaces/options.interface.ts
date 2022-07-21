import { Options as HtmlMinifierOptions } from "html-minifier-terser";
import { JSBeautifyOptions } from 'js-beautify';
import { TemplateOptions } from 'lodash';

interface BaseOptions {
  title?: string;
  filename?: string;
  favicon?: string | null;
  template?: string;
  options?: TemplateOptions;
}

interface OptionsWithMinify extends BaseOptions {
  /**
   * if minify true format must be false 
  */
  minify?: true | HtmlMinifierOptions;
  format?: false | never;
  // content?: Record<string, string>;
}

interface OptionsWithFormat extends BaseOptions {
  /**
   * if minify true format must be false 
  */
  minify?: false;
  format?: boolean | JSBeautifyOptions;
}

export type Options = OptionsWithMinify | OptionsWithFormat;
