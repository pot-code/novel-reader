import * as vscode from 'vscode';

import { IChapterTree, INovelWebview } from './types';
import { Chapter } from './Chapter';

export default class WebviewToTreeBride {
  private _webview: INovelWebview | null = null;
  private _tree: IChapterTree<Chapter> | null = null;

  set_webview(webview: vscode.Webview) {
    this._webview = webview;
  }

  set_tree(tree: IChapterTree<Chapter>) {
    this._tree = tree;
  }

  push_chapter(chaper: Chapter) {}
}
