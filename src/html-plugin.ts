import type { BuildResult, Metafile, PluginBuild } from 'esbuild';
import { writeFile } from 'fs/promises';
import { extname, relative, resolve } from 'path';
import { PluginConfig } from './plugin-config';
import type { Config, Options } from './interfaces';
import { TemplateBuilder } from './template-builder';

export class HtmlPlugin {

  constructor (
    private readonly build: PluginBuild,
    private readonly config: Config
  ) {}

  public static async init (
    build: PluginBuild,
    options: Partial<Options>
  ): Promise<void> {

    const config = await PluginConfig.create(build, options);
    const plugin = new HtmlPlugin(build, config);

    build.onEnd(plugin.onEnd.bind(plugin));
    // build.onStart(plugin.onStart.bind(plugin));

  }

  // private onStart (): void { }
  private async onEnd (result: BuildResult): Promise<void> {

    const template = this.buildTemplate(result);

    const html = await template.serialize();

    const path = resolve(
      this.build.initialOptions.outdir as string,
      this.config.filename
    );
    await writeFile(path, html);
  }

  private buildTemplate (result: BuildResult): TemplateBuilder {

    const template = new TemplateBuilder(this.config);
    const [jsFiles, cssFiles] = this.resolveBuildFiles(result);

    if (this.config.title) {
      template.setTitle(this.config.title);
    }

    for (const file of jsFiles) {
      template.appendScript(file);
    }

    for (const file of cssFiles) {
      template.appendStyle(file);
    }

    return template;
  }

  private resolveBuildFiles (result: BuildResult): [string[], string[]] {

    const files = Object
      .keys((result.metafile as Metafile).outputs)
      .map((file) => relative(this.build.initialOptions.outdir!, file));

    return [
      files.filter((file) => extname(file) === '.js'),
      files.filter((file) => extname(file) === '.css')
    ];
  }

}
