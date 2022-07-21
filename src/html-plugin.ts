import { BuildResult, PluginBuild, Metafile } from 'esbuild';
import { writeFile } from 'fs/promises';
import { extname, relative, resolve } from 'path';
import { PluginConfig } from './plugin-config';
import { Options, Config } from './interfaces';
import { TemplateBuilder } from './template-builder';

export class HtmlPlugin {

  constructor(
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
    build.onStart(plugin.onStart.bind(plugin));

  }

  private onStart (): void { }
  private async onEnd (result: BuildResult): Promise<void> {

    const template = await this.buildTemplate(result);

    const html = await template.serialize();

    console.log(html)
    const path = resolve(
      this.build.initialOptions.outdir as string,
      this.config.filename
    );
    await writeFile(path, html);
  }

  private async buildTemplate(result: BuildResult): Promise<TemplateBuilder> {

    const template = new TemplateBuilder(this.config);
    const [ jsFiles, cssFiles ] = this.getBuildFiles(result);

    if (this.config.title) {
      template.setTitle(this.config.title);
    }

    for (const src of jsFiles) {
      template.appendScript(src);
    }

    for (const src of cssFiles) {
      template.appendStyle(src);
    }

    return template;
  }

  private getBuildFiles(result: BuildResult): [string[], string[]] {

    const files = Object
      .keys((result.metafile as Metafile).outputs)
      .map((file) => relative(
        this.build.initialOptions.outdir as string,
        file
      ))

    return [
      files.filter((file) => extname(file) === '.js'),
      files.filter((file) => extname(file) === '.css')
    ]
  }

}
