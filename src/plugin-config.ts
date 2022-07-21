import type { PluginBuild } from 'esbuild';
import { access, readFile } from 'fs/promises';
import type { Options as HtmlMinifierOptions } from 'html-minifier-terser';
import type { JSBeautifyOptions } from 'js-beautify';
import type { TemplateOptions } from 'lodash';
import defaults from 'lodash.defaults';
import {
  DEFAULT_FILENAME,
  DEFAULT_FORMAT_OPTIONS,
  DEFAULT_MINIFIER_OPTIONS,
  DEFAULT_TEMPLATE
} from './constants';
import type { Config, Options } from './interfaces';

export class PluginConfig implements Config {

  public readonly filename: string;
  public readonly minify: HtmlMinifierOptions | null;
  public readonly format: JSBeautifyOptions | null;
  public readonly title: string | null;
  public readonly template: string;
  public readonly content: TemplateOptions | null;
  public readonly favicon: string;

  private constructor (config: Config) {

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
        ? DEFAULT_MINIFIER_OPTIONS
        : config.minify || null,

      format: config.format === true
        ? DEFAULT_FORMAT_OPTIONS
        : config.format || null
    });
  }

  private static async resolveTemplate (
    build: PluginBuild,
    template: string
  ): Promise<string> {

    const isAccess = await access(template)
      .then(() => true)
      .catch(() => false);

    if (isAccess) {
      return readFile(template, 'utf-8');
    }

    return template;
  }
}