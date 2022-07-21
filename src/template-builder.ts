import { minify } from 'html-minifier-terser';
import beautify from 'js-beautify';
import type { DOMWindow } from 'jsdom';
import { JSDOM } from 'jsdom';
import type { Config } from './interfaces';
import template from 'lodash.template';

export class TemplateBuilder {

  private readonly document: Document;
  private readonly window: DOMWindow;
  private readonly dom: JSDOM;

  constructor (private readonly config: Config) {
    const dom = new JSDOM(config.template);

    this.window = dom.window;
    this.dom = dom;
    this.document = dom.window.document;
  }

  public setTitle (title: string): this {

    this.document.title = title;
    return this;
  }

  public appendScript (src: string): this {

    const script = this.document.createElement('script');

    script.setAttribute('src', src);
    script.setAttribute('type', 'text/javascript');

    this.document.body.appendChild(script);
    return this;
  }

  public appendStyle (href: string): this {

    const link = this.document.createElement('link');

    link.setAttribute('type', 'text/css');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);

    this.document.head.appendChild(link);
    return this;
  }

  // TODO
  public appendMeta (): this {

    const meta = this.document.createElement('meta');

    meta.setAttribute('http-equiv', 'X-UA-Compatible');
    meta.setAttribute('content', 'IE=Edge');

    this.document.head.appendChild(meta);
    return this;
  }

  public async serialize (): Promise<string> {

    const serialized = this.dom.serialize();

    const html = this.config.content
      ? template(serialized)(this.config.content)
      : serialized;

    if (this.config.minify) {
      return minify(html, this.config.minify);
    }

    if (this.config.format) {
      return beautify.html(html, this.config.format);
    }

    return html;
  }

}
