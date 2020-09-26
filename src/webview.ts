import * as vscode from 'vscode';
import * as path from 'path';

import * as assets from './assets';
/**
 * class for building html string for webview
 */
class WebviewHTML {
  private scripts: vscode.Uri[];
  private styles: vscode.Uri[];
  private root: string;

  constructor(root: string) {
    this.scripts = [];
    this.styles = [];
    this.root = root;
  }
  add_script(uri: vscode.Uri) {
    this.scripts.push(uri);
  }
  add_style(uri: vscode.Uri) {
    this.styles.push(uri);
  }
  to_string() {
    const scripts = this.scripts;
    const styles = this.styles;
    return [
      '<!DOCTYPE html>', //
      '<html>', //
      '    <head>',
      '        <meta charset="UTF-8" />',
      '        <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
      ...styles.map((style) => `        <link type="text/css" rel="stylesheet" href="${style}">`),
      '    </head>',
      '    <body>',
      `        <div id="${this.root}"></div>`,
      ...scripts.map((script) => `        <script src="${script}"></script>`),
      '    </body>',
      '</html>'
    ].join('\n');
  }
}

/**
 * get the vscode URI from local file regarding the given webview panel
 * @param ctx vscode context
 * @param panel webview panel to use
 * @param segments resource path segments
 */
function get_webview_uri(ctx: vscode.ExtensionContext, panel: vscode.WebviewPanel, segments: string[]): vscode.Uri {
  const ctx_path = path.join(ctx.extensionPath, ...segments);
  const vs_uri = vscode.Uri.file(ctx_path);
  return panel.webview.asWebviewUri(vs_uri);
}

export default function (ctx: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel('preview', 'Viewer', vscode.ViewColumn.One, {
    enableScripts: true
  });
  const view_html = new WebviewHTML('root');

  // add styles, sync with webpack output
  assets.styles.forEach((style) => {
    const uri = get_webview_uri(ctx, panel, style);
    view_html.add_style(uri);
  });
  // add scripts
  assets.scripts.forEach((script) => {
    const uri = get_webview_uri(ctx, panel, script);
    view_html.add_script(uri);
  });
  panel.webview.html = view_html.to_string();
}
