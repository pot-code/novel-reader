import * as vscode from 'vscode';
import * as path from 'path';
import * as ejs from 'ejs';
import * as fs from 'fs';
import { EOL } from 'os';

import { INovelWebview } from './types';
import { ReaderRequestType, IVsCodeMessage, VSCODE_MESSAGE_SOURCE, VsCodeResponseType } from './shared';
import { Chapter } from './Chapter';
import WebviewToTreeBride from './bridge';

interface IHTMLAssets {
  styles: string[];
  scripts: string[];
}

/**
 * parse manifest.json and return assets info
 * @param manifest_path manifest.json path in build directory
 */
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
      const local_path = manifest_obj![entry];
      if (/\.css$/.test(entry)) {
        styles.push(local_path);
      } else if (/\.js$/.test(entry)) {
        scripts.push(local_path);
      }
    });
  }
  return { styles, scripts };
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

function theme_kind_to_string(kind: number): string {
  const MAPPING = ['', 'light', 'dark', 'high-contrast'];
  if (kind >= 0 && kind < MAPPING.length) {
    return MAPPING[kind];
  }
  return MAPPING[1];
}

type DisposeCallback = (self: NovelWebview) => void;

class NovelWebview implements INovelWebview {
  static ViewType = 'preview';
  static ViewTitle = 'Viewer';
  static ViewColumn = vscode.ViewColumn.One;

  private _panel: vscode.WebviewPanel;
  private _ctx: vscode.ExtensionContext;
  private _bridge: WebviewToTreeBride;
  private _dispose_callbacks: DisposeCallback[] = [];
  constructor(ctx: vscode.ExtensionContext, bridge: WebviewToTreeBride) {
    this._panel = vscode.window.createWebviewPanel(
      NovelWebview.ViewType,
      NovelWebview.ViewTitle,
      NovelWebview.ViewColumn,
      {
        enableScripts: true
      }
    );
    this._ctx = ctx;
    this._bridge = bridge;
    this._load_html();
    this._panel.onDidDispose(this._on_dispose, this);
    this._panel.webview.onDidReceiveMessage(this.on_webview_message, this);

    bridge.set_webview(this);
    bridge.fetch_init_data();
    vscode.window.onDidChangeActiveColorTheme(this.on_color_theme_change, this);
  }

  on_dispose(cb: DisposeCallback) {
    this._dispose_callbacks.push(cb);
  }

  receive_chapter(chapter: Chapter, total: number) {
    const webview = this._panel.webview;
    const content = chapter.get_content();
    const lines = content.split(EOL).filter((line) => line.trim() !== '');

    webview.postMessage({
      source: VSCODE_MESSAGE_SOURCE,
      type: VsCodeResponseType.DATA,
      payload: {
        total,
        lines,
        index: chapter.index,
        title: chapter.title
      }
    } as IVsCodeMessage);
  }

  on_color_theme_change() {
    const webview = this._panel.webview;
    const theme_kind = vscode.window.activeColorTheme.kind;
    const theme = theme_kind_to_string(theme_kind);

    webview.postMessage({
      source: VSCODE_MESSAGE_SOURCE,
      type: VsCodeResponseType.THEME,
      payload: theme
    } as IVsCodeMessage);
  }

  on_webview_message(msg: IVsCodeMessage) {
    const bridge = this._bridge;
    switch (msg.type) {
      case ReaderRequestType.INIT:
        bridge.fetch_init_data();
        break;
      case ReaderRequestType.PAGE:
        bridge.fetch_page_data(msg.payload);
        break;
      default:
        vscode.window.showErrorMessage(`Unsupported message type ${msg.type}`);
    }
  }

  reveal() {
    this._panel.reveal(NovelWebview.ViewColumn);
  }

  private _get_render_data(): any {
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

    const theme_kind = vscode.window.activeColorTheme.kind;
    const theme = theme_kind_to_string(theme_kind);

    return { ...assets, theme };
  }

  private _load_html() {
    const ctx = this._ctx;
    const panel = this._panel;
    const template_path = path.resolve(ctx.extensionPath, 'assets', 'webview', 'template.ejs');
    const data = this._get_render_data();

    ejs.renderFile(template_path, data, (err, content) => {
      if (err !== null) {
        vscode.window.showErrorMessage(`Failed to render ejs: ${err.message}`);
      } else {
        panel.webview.html = content;
      }
    });
  }

  private _on_dispose() {
    this._bridge.set_webview(null);
    for (const cb of this._dispose_callbacks) {
      cb(this);
    }
  }
}

let singleton: NovelWebview | null;

export default function (ctx: vscode.ExtensionContext, bridge: WebviewToTreeBride) {
  if (!singleton) {
    singleton = new NovelWebview(ctx, bridge);
    singleton.on_dispose(() => {
      singleton = null;
    });
  } else {
    singleton.reveal();
  }
}
