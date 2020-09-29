import * as vscode from 'vscode';
import * as os from 'os';
import { Chapter } from './Chapter';
import { IChapterTree } from './types';

const EXTRACT_CHAPTER_REGEXP = /^第([一二三四五零六七八九十百千万]+|\d+)[章回]|^番外/;

class NovelMetaInfo {
  public name: string;
  public cursor: number;
  public total: number;

  constructor(name: string, cursor: number, total: number) {
    this.name = name;
    this.cursor = cursor;
    this.total = total;
  }
}

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
  private _view_cache: Map<vscode.Uri, Chapter[]>;
  private _meta_info: NovelMetaInfo | null = null;

  constructor(view_cache: Map<vscode.Uri, Chapter[]>) {
    this.onDidChangeTreeData = this._change_event.event;
    this._view_cache = view_cache;
  }

  getChildren(elem: Chapter): Thenable<Chapter[]> {
    const editor = vscode.window.activeTextEditor;
    if (elem || !editor) {
      return Promise.resolve([]);
    }

    const cache = this._view_cache;
    const uri = editor.document.uri;
    if (cache.has(uri)) {
      return Promise.resolve(cache.get(uri)!);
    }

    // re-calculate
    const items = extract_chapters(editor);
    cache.set(uri, items);
    return Promise.resolve(items);
  }

  getTreeItem(elem: Chapter): vscode.TreeItem {
    return elem;
  }

  invalidate_cache() {
    const cache = this._view_cache;
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const uri = editor.document.uri;
      cache.delete(uri);
    }
  }

  build_tree() {
    // construct the view tree if needed
    this._change_event.fire(null);
  }

  jump_to(chapter: Chapter) {
    const editor = vscode.window.activeTextEditor;
    editor?.revealRange(chapter.range, vscode.TextEditorRevealType.AtTop);
  }

  private _fill_meta_info(editor: vscode.TextEditor, cursor: number, total: number) {
    this._meta_info = new NovelMetaInfo('', cursor, total);
  }
}
