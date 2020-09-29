import * as vscode from 'vscode';
import * as os from 'os';
import { Chapter } from './Chapter';
import { IChapterTree } from './types';
import WebviewToTreeBride from './bridge';

const EXTRACT_CHAPTER_REGEXP = /^第([一二三四五零六七八九十百千万]+|\d+)[章回]|^番外/;

/**
 * extract chapter data from given editor
 * @param editor editor contains text content for operation
 */
function extract_chapters(editor: vscode.TextEditor): Chapter[] {
  const full_text = editor.document.getText();
  const lines = full_text.split(os.EOL);

  // dummy data
  lines.push('第一章');

  let start = -1;
  let title = '';
  let chapter_index = 0;
  return lines.reduce((acc, line, idx) => {
    if (EXTRACT_CHAPTER_REGEXP.test(line)) {
      if (title !== '') {
        const start_pos = new vscode.Position(start, 0);
        const end_pos = new vscode.Position(idx, 0);
        acc.push(new Chapter(new vscode.Range(start_pos, end_pos), title, chapter_index, editor));
        chapter_index++;
      }
      start = idx + 1;
      title = line.trim();
    }
    return acc;
  }, [] as Chapter[]);
}

export class ChaterDataProvider implements IChapterTree<Chapter> {
  onDidChangeTreeData: vscode.Event<Chapter | null>;

  private _change_event: vscode.EventEmitter<Chapter | null> = new vscode.EventEmitter<Chapter | null>();
  private _bridge: WebviewToTreeBride;
  private _view_cache: Map<vscode.Uri, Chapter[]>;
  private _selected: Chapter | null = null;
  private _total: number = -1;
  private _items: Chapter[] | null = null;

  constructor(view_cache: Map<vscode.Uri, Chapter[]>, bridge: WebviewToTreeBride) {
    this.onDidChangeTreeData = this._change_event.event;
    this._view_cache = view_cache;
    this._bridge = bridge;

    bridge.set_tree(this);
  }

  getChildren(elem: Chapter): Thenable<Chapter[]> {
    const editor = vscode.window.activeTextEditor;
    if (elem || !editor) {
      return Promise.resolve([]);
    }

    // get from cache
    const cache = this._view_cache;
    const uri = editor.document.uri;
    if (cache.has(uri)) {
      this._items = cache.get(uri)!;
      this._selected = null;
      this._total = this._items.length;
      return Promise.resolve(this._items);
    }

    // re-calculate
    const items = extract_chapters(editor);
    cache.set(uri, items);
    this._total = items.length;
    this._items = items;
    this._selected = null;
    return Promise.resolve(items);
  }

  getTreeItem(elem: Chapter): vscode.TreeItem {
    return elem;
  }

  build_tree() {
    // construct the view tree if needed
    this._change_event.fire(null);
  }

  jump_to(chapter: Chapter) {
    const editor = vscode.window.activeTextEditor;

    this._selected = chapter;
    editor?.revealRange(chapter.range, vscode.TextEditorRevealType.AtTop);
    this.push_current_state();
  }

  reset() {
    this._invalidate_cache();
  }

  push_current_state() {
    const bridge = this._bridge;
    if (this._selected !== null) {
      bridge.push_chapter(this._selected, this._total);
    } else if (this._items !== null) {
      const fallback = this._items[0];
      bridge.push_chapter(fallback, this._total);
    }
  }

  push_next_state(index: number) {
    const bridge = this._bridge;
    if (this._items !== null) {
      const chapter = this._items[index];
      bridge.push_chapter(chapter, this._total);
      this._selected = chapter;
    }
  }

  private _invalidate_cache() {
    const cache = this._view_cache;
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const uri = editor.document.uri;
      cache.delete(uri);
    }
  }
}
