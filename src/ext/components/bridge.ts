import * as vscode from 'vscode';

import { IChapterTree, INovelWebview } from './types';
import { Chapter } from './Chapter';

export default class WebviewToTreeBride {
  private _webview: INovelWebview | null = null;
  private _tree: IChapterTree<Chapter> | null = null;

  set_webview(webview: INovelWebview | null) {
    this._webview = webview;
  }

  set_tree(tree: IChapterTree<Chapter>) {
    this._tree = tree;
  }

  push_chapter(chaper: Chapter, total: number) {
    this._webview?.receive_chapter(chaper, total);
  }

  fetch_init_data() {
    this._tree?.push_current_state();
  }

  fetch_page_data(index: number) {
    this._tree?.push_next_state(index);
  }
}
