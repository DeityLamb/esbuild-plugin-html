import { PluginBuild } from 'esbuild';
import { access, readFile } from 'fs/promises';
import { Options as HtmlMinifierOptions } from "html-minifier-terser";
import { JSBeautifyOptions } from 'js-beautify';
import { TemplateOptions } from 'lodash';
import defaults from 'lodash.defaults';
import { DEFAULT_FILENAME, DEFAULT_TEMPLATE } from './constants';
import { Config, Options } from './interfaces';

const defaultMinifierOptions: HtmlMinifierOptions = {
  collapseWhitespace: true,
  keepClosingSlash: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true
}

const defaultFormatOptions: JSBeautifyOptions = {
  indent_size: 2,
  preserve_newlines: false
}

export class PluginConfig implements Config {

  public readonly filename: string;
  public readonly minify: HtmlMinifierOptions | null;
  public readonly format: JSBeautifyOptions | null;
  public readonly title: string | null;
  public readonly template: string;
  public readonly content: TemplateOptions | null;
  public readonly favicon: string;

  private constructor(config: Config) {
    this.filename = config.filename;
    this.minify = config.minify;
    this.title = config.title;
    this.favicon = config.favicon || '';
    this.template = config.template;
    this.format = config.format;
    this.content = config.content;
  }

  public static async create (
    build: PluginBuild,
    props: Options
  ): Promise<PluginConfig> {

    const config = defaults(props, {
      favicon: null,
      title: null,
      minify: build.initialOptions.minify || false,
      format: false,
      filename: DEFAULT_FILENAME,
      template: DEFAULT_TEMPLATE,
      content: null
    }) as Config;

    return new PluginConfig({
      ...config,
      template: await this.resolveTemplate(build, config.template),

      minify: config.minify === true
        ? defaultMinifierOptions
        : config.minify || null,

      format: config.format === true
        ? defaultFormatOptions
        : config.format || null
    });
  } 

  private static async resolveTemplate(
    build: PluginBuild,
    template: string
  ): Promise<string> {
    const isAccess = await access(template)
      .then(() => true)
      .catch(() => false);

    if (!isAccess) {
      return template;
    }

    return readFile(template, 'utf-8');
    return template;
  }
}