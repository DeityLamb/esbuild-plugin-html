import type { Plugin, PluginBuild } from 'esbuild';
import { PLUGIN_NAME } from './constants';
import { HtmlPlugin } from './html-plugin';
import type { Options } from './interfaces';

export const htmlPlugin = (options: Options = {}): Plugin => {
  return {
    name: PLUGIN_NAME,
    async setup (build: PluginBuild): Promise<void> {

      if (!build.initialOptions.outdir) {
        return;
      }

      if (!build.initialOptions.metafile) {
        throw new Error('metafile is not enabled');
      }

      await HtmlPlugin.init(build, options);
    }
  };
};
