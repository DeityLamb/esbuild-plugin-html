import { build, BuildOptions } from 'esbuild'
import { clean } from 'esbuild-plugin-clean'
import { htmlPlugin } from '../src';

const OUTDIR = './spec/dist';

const config: BuildOptions = {
  entryPoints: ['./spec/files/index.ts'],
  bundle: true,
  outdir: OUTDIR,
  entryNames: '[hash].[name]',
  minify: true,
  metafile: true,
  plugins: [
    htmlPlugin({
      minify: false,
      format: true,
      title: 'Hello',
      template: './spec/files/index.html'
    }),
    clean({ patterns: [OUTDIR] })
  ]
}

describe('ESBuildPluginHtml', () => {
  it('should to work', async () => {
    await build(config);
  })
});
