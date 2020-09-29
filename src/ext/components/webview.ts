import * as vscode from 'vscode';
import * as path from 'path';
import * as ejs from 'ejs';
import * as fs from 'fs';

import { INovelWebview } from './types';
import { ReaderRequestType } from './shared';

interface IHTMLAssets {
  styles: string[];
  scripts: string[];
}

function parse_webpack_manifest(manifest_path: string): IHTMLAssets {
  let manifest_obj: { [key: string]: string } | null = null;
  try {
    const content = fs.readFileSync(manifest_path);
    manifest_obj = JSON.parse(content.toString());
  } catch (err) {
    throw Error(`Failed to parse manifest file: ${err.message}`);
  }

  const styles: string[] = [];
  const scripts: string[] = [];
  if (manifest_obj !== null) {
    Object.keys(manifest_obj).forEach((entry) => {
      if (/\.css$/.test(entry)) {
        const local_path = manifest_obj![entry];
        styles.push(local_path);
      } else if (/\.js$/.test(entry)) {
        const local_path = manifest_obj![entry];
        scripts.push(local_path);
      }
    });
  }
  return { styles, scripts };
}

class NovelWebview implements INovelWebview {
  static ViewType = 'preview';
  static ViewTitle = 'Viewer';

  private _panel: vscode.WebviewPanel;
  private _ctx: vscode.ExtensionContext;
  constructor(ctx: vscode.ExtensionContext) {
    this._panel = vscode.window.createWebviewPanel(
      NovelWebview.ViewType,
      NovelWebview.ViewTitle,
      vscode.ViewColumn.One,
      {
        enableScripts: true
      }
    );
    this._ctx = ctx;
    this._load_html();
  }

  private _load_html() {
    const ctx = this._ctx;
    const panel = this._panel;
    const manifest_path = path.resolve(ctx.extensionPath, 'assets', 'webview', 'manifest.json');

    let assets: IHTMLAssets | null;
    try {
      assets = parse_webpack_manifest(manifest_path);
    } catch (err) {
      vscode.window.showErrorMessage(err.message);
      return;
    }

    if (assets === null) {
      return;
    }
    assets.styles = assets.styles.map((style) => get_webview_uri(ctx, panel, style.split('/')).toString());
    assets.scripts = assets.scripts.map((script) => get_webview_uri(ctx, panel, script.split('/')).toString());

    const template_path = path.resolve(ctx.extensionPath, 'assets', 'webview', 'template.ejs');
    ejs.renderFile(template_path, assets, (err, content) => {
      if (err !== null) {
        vscode.window.showErrorMessage(`Failed to render ejs: ${err.message}`);
      } else {
        panel.webview.html = content;
      }
    });
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
  // const view_html = new WebviewHTML('root');
  const webview = new NovelWebview(ctx);
  console.log(ReaderRequestType.DATA);
  // // add styles, sync with webpack output
  // assets.styles.forEach((style) => {
  //   const uri = get_webview_uri(ctx, panel, style);
  //   view_html.add_style(uri);
  // });
  // // add scripts
  // assets.scripts.forEach((script) => {
  //   const uri = get_webview_uri(ctx, panel, script);
  //   view_html.add_script(uri);
  // });
  // panel.webview.html = view_html.to_string();
}
