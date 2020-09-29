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
    if (this._tree !== null) {
      const [chapter, total] = this._tree.get_current_state();
      if (chapter !== null) {
        this._webview?.receive_chapter(chapter, total);
      }
    }
  }

  fetch_page_data(index: number) {
    if (this._tree !== null) {
      const [chapter, total] = this._tree.get_next_state(index);
      if (chapter !== null) {
        this._webview?.receive_chapter(chapter, total);
      }
    }
  }
}
